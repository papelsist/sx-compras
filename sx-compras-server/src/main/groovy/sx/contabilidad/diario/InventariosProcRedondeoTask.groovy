package sx.contabilidad.diario


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet

@Slf4j
@Component
class InventariosProcRedondeoTask implements  AsientoBuilder {

    /**
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos para inventarios redondeo")
        String sql = getSelect()
                //.replaceAll("@FECHA", toSqlDate(poliza.fecha))
                .replaceAll("@MES", poliza.mes.toString())
                .replaceAll("@EJERCICIO", poliza.ejercicio.toString())

       // println sql                   

        List rows = getAllRows(sql, [])
        rows.each { row ->
            String descripcion = generarDescripcion(row)
            if(row.redondeo > 0.0) {
                poliza.addToPartidas(mapRow(poliza,
                        row.cta_contable.toString(),
                        descripcion,
                        row,
                        row.redondeo))
            }else {
                poliza.addToPartidas(mapRow( poliza,
                        row.cta_contable.toString(),
                        descripcion,
                        row,
                        0.0,
                        row.redondeo))
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
                entidad: 'NA',
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
        sum(x.costo_final) - sum(x.costo) redondeo,             
        x.sucursal,
        x.suc,        
        'REDONDEO' asiento,        
        CONCAT('115-0001-',(CASE WHEN x.suc<10 THEN '000' ELSE '00' END),x.suc,'-0000') cta_contable        
        FROM (
        select '02 COMPRAS' AS grupo,S.clave suc,S.NOMBRE sucursal,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * i.gasto),2) as costo,0 costo_final,i.id
        from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
        where I.TIPO in('COM','MAQ') AND I.GASTO>0 and YEAR(I.FECHA)=((@EJERCICIO)) AND MONTH(I.FECHA)=(((@MES))) AND I.CLAVE LIKE '%' and s.activa is true group by 3
        UNION
        select (CASE WHEN I.TIPO IN('COM','DEC') THEN '02 COMPRAS' WHEN I.TIPO IN('AJU','CIM','CIS','MER','RMC') THEN '03 GASTO' WHEN I.TIPO IN('VIR','OIM') THEN '04 PRODUCTO'
                    WHEN I.TIPO IN('REC','TRS','MAQ') THEN '05 TRANSFORM' WHEN I.TIPO IN('TPE','TPS') THEN '06 TRASLADO' WHEN I.TIPO IN('FAC','RMD') THEN '07 VENTAS' ELSE 'OTROS' END) AS GRUPO,S.clave SUC,S.NOMBRE SUCURSAL
        ,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.tipo IN('COM','DEC') and i.costo>0 then i.costo when i.TIPO IN('TRS','REC','MAQ') AND I.CANTIDAD>0 then i.costo else I.COSTO_promedio end)),2) as COSTO,0 COSTO_FINAL,i.id
        from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
        where p.inventariable is true and YEAR(I.FECHA)=((@EJERCICIO)) AND MONTH(I.FECHA)=(((@MES))) AND I.CLAVE LIKE '%' and s.activa is true group by 1,3 
        UNION
        SELECT '01 A_INV' AS GRUPO,s.clave SUC,S.NOMBRE SUCURSAL,ROUND(SUM(I.EXISTENCIA_INICIAL/(case when p.unidad ='MIL' then 1000 else 1 end) * I.COSTO ),2) as COSTO,0 COSTO_FINAL,i.id
        FROM existencia i join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id) where p.inventariable is true and i.anio=((@EJERCICIO)) AND i.mes=(((@MES)))  AND I.CLAVE LIKE '%' and s.activa is true group by 3
        UNION
        SELECT '08 Z_INV' AS GRUPO,s.clave SUC,S.NOMBRE SUCURSAL,0 COSTO,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * I.costo_promedio ),2) as COSTO_FINAL,i.id
        FROM existencia i join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id) where p.inventariable is true and i.anio=((@EJERCICIO)) AND i.mes=(((@MES)))  AND I.CLAVE LIKE '%' and s.activa is true group by 3
        ) as x group by 2
        """
        return res
    }

}
