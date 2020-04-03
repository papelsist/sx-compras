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

        // println sql

        List rows = getAllRows(sql, [])
        rows.each { row ->
            log.info('Procesando: {}',row)
            String descripcion = generarDescripcion(row)
            if(row.costo > 0.0) {
                if(row.referencia2 == '06 TRASLADOS'){
                    poliza.addToPartidas(mapRow(
                        poliza,
                        row.cta_contable.toString(),
                        descripcion,
                        row,
                        row.costo))
                }
                if(row.referencia2 != '06 TRASLADOS'){
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
                } 
            }else {
                if(row.referencia2 == '06 TRASLADOS'){
                    poliza.addToPartidas(mapRow(
                        poliza,
                        row.cta_contable.toString(),
                        descripcion,
                        row,
                        0.00,
                        row.costo))
                }
                if(row.referencia2 != '06 TRASLADOS'){
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
                referencia2: row.referencia2.substring(3),
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
        round(sum(x.costo),2) costo,                  
        x.sucursal,
        x.suc,        
        x.asiento,
        x.proveedor,
        (case when sum(x.costo)>0 and x.asiento='AJU Y CIM' then '04 PRODUCTO' else x.grupo end) referencia2,        
        (case   when ASIENTO='AJU Y CIM' AND sum(X.COSTO)>0 then  '704-0005-0000-0000'
                when ASIENTO='TRANSFORMACIONES' AND sum(X.COSTO)>0 then  REPLACE(x.cta_contable,'703-0001','704-0005')
                when ASIENTO='TRANSFORMACIONES' AND sum(X.COSTO)<0 then  REPLACE(x.cta_contable,'704-0005','703-0001') else x.cta_contable end) cta_contable  
        FROM (        	   
        SELECT 'FLETES PROVEEDOR' ASIENTO,'FLT' TIPO,'02 COMPRAS' AS grupo,s.sw2,S.clave SUC,S.NOMBRE SUCURSAL,P.CLAVE,P.DESCRIPCION 
        ,0 as kilos,0 as saldo,  sum( (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * i.gasto) ) as COSTO
        ,(select x.nombre from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventariox=i.id  ) PROVEEDOR                
        ,concat('115-0004-',(SELECT o.cuenta_operativa FROM recepcion_de_compra_det d   join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id) join cuenta_operativa_proveedor o on(o.proveedor_id=x.id) where d.inventariox=i.id ),'-0000') CTA_CONTABLE
        from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
        where p.inventariable is true and YEAR(I.FECHA)=YEAR('@FECHA') AND MONTH(I.FECHA)=MONTH('@FECHA') AND I.CLAVE LIKE '%'
        AND I.TIPO IN('COM') AND I.GASTO>0 GROUP BY 6,7,12,13
        	union
        SELECT 'MAQUILA PROVEEDOR' ASIENTO,'MAQ' TIPO,'02 COMPRAS' AS grupo,s.sw2,S.clave SUC,S.NOMBRE SUCURSAL,P.CLAVE,P.DESCRIPCION 
        ,0 as kilos,0 as saldo,   SUM( (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * i.gasto) ) as COSTO
        ,ifnull((select max(x.nombre) from transformacion_det d join analisis_de_transformacion_det a on(d.id=a.trs_id) join analisis_de_transformacion t on(a.analisis_id=t.id) join proveedor x on(t.proveedor_id=x.id) where d.inventario_id=i.id  ),'TRANSITO') PROVEEDOR                
        ,ifnull(concat('115-0011-'
        ,(select max(o.cuenta_operativa) from transformacion_det d join analisis_de_transformacion_det a on(d.id=a.trs_id) join analisis_de_transformacion t on(a.analisis_id=t.id) join proveedor x on(t.proveedor_id=x.id) join cuenta_operativa_proveedor o on(o.proveedor_id=x.id) where d.inventario_id=i.id  )
        ,(CASE WHEN S.CLAVE<10 THEN '-000' ELSE '-00' END),S.CLAVE
        ),'115-0015-0000-0000') CTA_CONTABLE
        from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
        where p.inventariable is true and  YEAR(I.FECHA)=YEAR('@FECHA') AND MONTH(I.FECHA)=MONTH('@FECHA') AND I.CLAVE LIKE '%'
        AND I.TIPO IN('MAQ') AND I.GASTO>0 GROUP BY 6,7,12,13
            union 
        select a.ASIENTO,a.TIPO,a.GRUPO,a.sw2,a.SUC,a.SUCURSAL,a.CLAVE,a.DESCRIPCION,SUM(a.KILOS) KILOS,SUM(a.SALDO) SALDO,SUM(a.COSTO) COSTO,a.PROVEEDOR,a.CTA_CONTABLE 
        from (        
        SELECT (CASE WHEN i.TIPO IN('COM') AND I.COSTO=0 THEN 'COMPRAS_SNA'
        WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN 'COMPRAS'
        WHEN i.TIPO IN('DEC') THEN 'DEVOLUCIONES DE COMPRAS'
        WHEN i.TIPO IN('FAC') THEN 'COSTO DE VENTA'
        WHEN i.TIPO IN('RMD') THEN 'DEVOLUCION'
        WHEN i.TIPO IN('AJU','CIM') THEN 'AJU Y CIM'
        WHEN i.TIPO IN('MER','RMC','OIM','VIR') AND I.CANTIDAD>0 THEN 'MOVTOS DE ALMACEN OPRD'
        WHEN i.TIPO IN('MER','RMC','OIM','VIR') AND I.CANTIDAD<0 THEN 'MOVTOS DE ALMACEN OGST'
        WHEN i.TIPO IN('TRS','REC','MAQ') THEN 'TRANSFORMACIONES'
        WHEN i.TIPO IN('TPS') THEN 'TRASLADOS_SALIDA' 
        WHEN i.TIPO IN('TPE') THEN 'TRASLADOS_ENTRADA' 
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PAPELERIA' THEN 'PAPELERIA Y COPIAS CIS OGST'
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='MATERIAL_EMPAQUE' THEN 'MATERIAL DE EMPAQUE CIS OGST'
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PUBLICIDAD_PROPAGANDA' THEN 'PUBLICIDAD PROPAGANDA CIS OGST'
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='NO_DEDUSIBLE' THEN 'NO DEDUCIBLE CIS OGST'
        ELSE TIPO END) ASIENTO
        ,(CASE WHEN i.TIPO IN('COM','DEC') AND I.COSTO=0 THEN 'SNA' WHEN i.TIPO IN('TRS','REC','MAQ') THEN 'TRS' ELSE TIPO END) AS TIPO
        ,(CASE WHEN I.TIPO IN('COM','DEC') THEN '02 COMPRAS' 
         WHEN I.TIPO IN('CIS','MER','RMC') AND I.CANTIDAD<0  THEN '03 GASTO' 
         WHEN I.TIPO IN('AJU','CIM') THEN '03 GASTO' 
         WHEN I.TIPO IN('VIR','OIM') AND I.CANTIDAD>0  THEN '04 PRODUCTO'
         WHEN I.TIPO IN('REC','TRS','MAQ') THEN '05 TRANSFORMACIONES' 
         WHEN I.TIPO IN('TPS') THEN '06 TRASLADOS'
         WHEN I.TIPO IN('TPE') THEN '06 TRASLADOS'
         WHEN I.TIPO IN('FAC','RMD') THEN '07 VENTAS' ELSE 'OTROS' END) AS GRUPO,s.sw2,S.clave SUC,S.NOMBRE SUCURSAL,P.CLAVE,P.DESCRIPCION
        ,ROUND(   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),3) as KILOS,ROUND(   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO
        ,    (   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.tipo IN('COM','DEC') and i.costo>0 then i.costo when i.TIPO IN('TRS','REC','MAQ') AND I.CANTIDAD>0 then i.costo else I.COSTO_promedio end)) ) as COSTO
        ,(CASE WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN (select x.nombre from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventariox=i.id  )
         WHEN i.TIPO IN('DEC') AND I.costo>0 THEN (select x.nombre from devolucion_de_compra_det d join devolucion_de_compra r on(d.devolucion_de_compra_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventario_id=i.id  )
         ELSE '' END) AS PROVEEDOR
        ,(CASE WHEN i.TIPO IN('COM') AND I.COSTO=0 THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN CONCAT('115-',(select (case when x.cuenta_operativa in('0061','0038') then concat('0002-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join cuenta_operativa_proveedor x on(r.proveedor_id=x.proveedor_id) where d.inventariox=i.id  ),(CASE WHEN S.CLAVE<10 THEN '-000' ELSE '-00' END),S.CLAVE)
        WHEN i.TIPO IN('DEC')  AND I.COSTO>0 THEN CONCAT('115-',(select (case when x.cuenta_operativa in('0061','0038') then concat('0005-',x.cuenta_operativa) else concat('0006-',x.cuenta_operativa) end) from devolucion_de_compra_det d join devolucion_de_compra r on(d.devolucion_de_compra_id=r.id) join cuenta_operativa_proveedor x on(r.proveedor_id=x.proveedor_id) where d.inventario_id=i.id  ),'-0000')
        WHEN i.TIPO IN('FAC') THEN CONCAT('501-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('RMD') THEN CONCAT('501-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('AJU','CIM') THEN CONCAT('600-0031-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('MER','RMC','OIM','VIR') AND I.CANTIDAD>0 THEN '704-0005-0000-0000'
        WHEN i.TIPO IN('MER','RMC','OIM','VIR') AND I.CANTIDAD<0 THEN CONCAT('600-0031-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('TRS','REC','MAQ') THEN CASE WHEN  (   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.tipo='COM' and i.costo>0 then i.costo when i.TIPO IN('TRS','REC','MAQ') AND I.CANTIDAD>0 then i.costo  else I.COSTO_promedio end))  )>0 THEN '704-0005-0000-0000' ELSE '703-0001-0000-0000' END
        WHEN i.TIPO IN('TPS') THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000') 
        WHEN i.TIPO IN('TPE') THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000') 
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PAPELERIA' THEN CONCAT('600-0032-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='MATERIAL_EMPAQUE' THEN CONCAT('600-0029-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PUBLICIDAD_PROPAGANDA' THEN CONCAT('600-0033-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
        WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='NO_DEDUSIBLE' THEN CONCAT('600-0031-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000') ELSE TIPO END) CTA_CONTABLE
        from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
        where p.inventariable is true and YEAR(I.FECHA)=YEAR('@FECHA') AND MONTH(I.FECHA)=MONTH('@FECHA')  AND I.CANTIDAD<>0 AND I.CLAVE LIKE '%'
        ) as a       
        group by 1,2,6,7,12             
        ) as x
        group by x.grupo,4,2,5
        """
        return res
    }

}
