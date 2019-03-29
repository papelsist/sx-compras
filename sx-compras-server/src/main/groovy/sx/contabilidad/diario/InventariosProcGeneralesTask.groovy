package sx.contabilidad.diario


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.utils.MonedaUtils

@Slf4j
@Component
class InventariosProcGeneralesTask implements  AsientoBuilder {

    /**
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos para inventarios generales")
        String sql = getSelect()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, [])
        rows.each { row ->
            String descripcion = generarDescripcion(row)
            if(row.costo > 0.0) {
                poliza.addToPartidas(mapRow(
                        poliza,
                        row.cta_contable.toString(),
                        descripcion,
                        row,
                        0.0,
                        row.costo))
                poliza.addToPartidas(mapRow(
                        poliza,
                        "115-0001-${row.suc.toString().padLeft(4,'0')}-0000",
                        descripcion,
                        row,
                        row.costo))
            }else {
                poliza.addToPartidas(mapRow(
                        poliza,
                        row.cta_contable.toString(),
                        descripcion,
                        row,
                        row.costo))
                poliza.addToPartidas(mapRow(
                        poliza,
                        "115-0001-${row.suc.toString().padLeft(4,'0')}-0000",
                        descripcion,
                        row,
                        0.0,
                        row.costo))
            }

        }

    }

    @Override
    String generarDescripcion(Map row) {
        return " ${row.asiento} ${row.sucursal}"
    }

    PolizaDet mapRow(Poliza poliza, String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        String ejercicio = poliza.fecha.format('yyyy')
        String mes = poliza.fecha.format('MM')
        String ref = "${row.asiento} (${ejercicio}-${mes})"
        descripcion = "${row.asiento}  (${ejercicio}-${mes}) ${row.sucursal}"
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: ref,
                referencia2: ref,
                origen: "${ejercicio}/${mes}",
                entidad: "",
                documento: '',
                documentoTipo: 'FAC',
                documentoFecha: null,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )
        return det
    }

    // QUERYES
    String getSelect() {

        String res = """
        SELECT 
        sum(x.costo) costo,                  
        x.sucursal,
        x.suc,        
        x.asiento,
        x.proveedor,
        x.grupo referencia2,        
        x.cta_contable        
        FROM (
        select 'FLETES PROVEEDOR' AS asiento,'FLT' TIPO  
        ,'02 COMPRAS' AS grupo,S.clave suc,S.NOMBRE sucursal,0 as kilos,0 as saldo
        ,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * i.gasto),2) as costo,x.nombre proveedor
        ,concat('115-0004-',(SELECT o.cuenta_operativa FROM cuenta_operativa_proveedor o where o.proveedor_id=x.id ),'-0000') as cta_contable,0 costo_final
        from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
         join recepcion_de_compra_det d on(d.inventario_id=i.id) join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id)
        where I.TIPO='COM' AND I.GASTO>0 and YEAR(I.FECHA)=YEAR('@FECHA') AND MONTH(I.FECHA)=MONTH('@FECHA') AND I.CLAVE LIKE '%' group by 5,9
        UNION
        select (CASE WHEN i.TIPO IN('COM') AND I.COSTO=0 THEN 'COMPRAS_SNA'
        WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN 'COMPRAS'
        WHEN i.TIPO IN('DEC') THEN 'DEVOLUCIONES DE COMPRAS'
        WHEN i.TIPO IN('FAC','RMD') THEN 'COSTO DE VENTA'
        WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD>0 THEN 'MOVTOS DE ALMACEN OPRD'
        WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD<0 THEN 'MOVTOS DE ALMACEN OGST'
        WHEN i.TIPO IN('TRS','REC') THEN 'TRANSFORMACIONES'
        WHEN i.TIPO IN('TPE','TPS') THEN 'TRASLADOS' 
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PAPELERIA' THEN 'PAPELERIA Y COPIAS'
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='MATERIAL_EMPAQUE' THEN 'MATERIAL DE EMPAQUE'
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PUBLICIDAD_PROPAGANDA' THEN 'PUBLICIDAD PROPAGANDA'
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='NO_DEDUSIBLE' THEN 'NO DEDUCIBLE'
        ELSE TIPO END) ASIENTO
        ,(CASE WHEN i.TIPO IN('COM') AND I.COSTO=0 THEN 'SNA' WHEN i.TIPO IN('TRS','REC') AND I.CANTIDAD>0 THEN concat('E',SUBSTR(i.tipo,1,2)) WHEN i.TIPO IN('TRS','REC') AND I.CANTIDAD<0 THEN concat('S',SUBSTR(i.tipo,1,2)) ELSE TIPO END) AS TIPO
        ,(CASE WHEN I.TIPO IN('COM') THEN '02 COMPRAS' WHEN I.TIPO IN('AJU','CIM','CIS','DEC','MER','RMC') THEN '03 GASTO' WHEN I.TIPO IN('VIR','OIM') THEN '04 PRODUCTO'
                    WHEN I.TIPO IN('REC','TRS') THEN '05 TRANSFORM' WHEN I.TIPO IN('TPE','TPS') THEN '06 TRASLADO' WHEN I.TIPO IN('FAC','RMD') THEN '07 VENTAS' ELSE 'OTROS' END) AS GRUPO,S.clave SUC,S.NOMBRE SUCURSAL
        ,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),3) as KILOS,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO
        ,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.tipo='COM' and i.costo>0 then i.costo when i.TIPO IN('TRS','REC') AND I.CANTIDAD>0 then i.costo else I.COSTO_promedio end)),2) as COSTO
        ,(CASE WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN (select x.nombre from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventario_id=i.id  )
        WHEN i.TIPO IN('DEC') AND I.costo_promedio>0 THEN (select x.nombre from devolucion_de_compra_det d join devolucion_de_compra r on(d.devolucion_de_compra_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventario_id=i.id  )
         ELSE '' END) AS PROVEEDOR
        ,(CASE WHEN i.TIPO IN('COM') AND I.COSTO=0 THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN CONCAT('115-',(select (case when x.cuenta_operativa in('0061','0038') then concat('0002-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join cuenta_operativa_proveedor x on(r.proveedor_id=x.proveedor_id) where d.inventario_id=i.id  ),'-0000')
        WHEN i.TIPO IN('DEC') THEN CONCAT('115-',(select (case when x.cuenta_operativa in('0061','0038') then concat('0005-',x.cuenta_operativa) else concat('0006-',x.cuenta_operativa) end) from devolucion_de_compra_det d join devolucion_de_compra r on(d.devolucion_de_compra_id=r.id) join cuenta_operativa_proveedor x on(r.proveedor_id=x.proveedor_id) where d.inventario_id=i.id  ),'-0000')
        WHEN i.TIPO IN('FAC','RMD') THEN CONCAT('501-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD>0 THEN '704-0005-0000-0000'
        WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD<0 THEN CONCAT('600-0031-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('TRS','REC') THEN CASE WHEN ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.tipo='COM' and i.costo>0 then i.costo when i.TIPO IN('TRS','REC') AND I.CANTIDAD>0 then i.costo else I.COSTO_promedio end)),2)>0 THEN '704-0005-0000-0000' ELSE '703-0001-0000-0000' END
        WHEN i.TIPO IN('TPE','TPS') THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000') 
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PAPELERIA' THEN CONCAT('600-0032-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='MATERIAL_EMPAQUE' THEN CONCAT('600-0029-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PUBLICIDAD_PROPAGANDA' THEN CONCAT('600-0033-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='NO_DEDUSIBLE' THEN CONCAT('600-0031-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        ELSE TIPO END) CTA_CONTABLE,0 COSTO_FINAL
        from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
        where p.inventariable is true and YEAR(I.FECHA)=YEAR('@FECHA') AND MONTH(I.FECHA)=MONTH('@FECHA') AND I.CLAVE LIKE '%' group by 1,2,5,9 
        ) as x
        group by 6,4,2,5 ,7
        """
        return res
    }

}
