package sx.costos

import groovy.sql.Sql
import org.apache.commons.lang.exception.ExceptionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

import javax.sql.DataSource
import java.sql.SQLException

class MovimientosCosteadosService {

    @Autowired
    @Qualifier('dataSource')
    DataSource dataSource

    
    def movimientos(Integer ejercicio, Integer mes) {
        String select = getSelect().replaceAll('@EJERCICIO', ejercicio.toString()).replaceAll("@MES", mes.toString())
        // println select
        return getLocalRows(select, [])
    }

    def getSelect() {
        return """
            SELECT A.CLAVE as clave ,x.de_linea as deLinea,A.DESCRIPCION as descripcion ,L.LINEA as linea, C.CLASE as clase, M.MARCA as marca 
            ,ROUND(SUM(CASE WHEN A.TIPO='INI' THEN A.SALDO ELSE 0 END) ,3) AS saldoInicial
            ,ROUND(SUM(CASE WHEN A.TIPO='INI' THEN A.COSTO ELSE 0 END) ,2) AS costoInicial
            ,ROUND(SUM(CASE WHEN A.TIPO='SNA' THEN A.SALDO ELSE 0 END) ,3) AS comsSinAUni
            ,ROUND(SUM(CASE WHEN A.TIPO='SNA' THEN A.COSTO ELSE 0 END) ,2) AS comsSinA
            ,ROUND(SUM(CASE WHEN A.TIPO='COM' THEN A.SALDO ELSE 0 END) ,3) AS comsUni
            ,ROUND(SUM(CASE WHEN A.TIPO='COM' THEN A.COSTO ELSE 0 END) ,2) AS comsCosto
            ,ROUND(SUM(CASE WHEN A.TIPO='FLT' THEN A.COSTO ELSE 0 END) ,2) AS comsFlete
            ,ROUND(SUM(CASE WHEN A.TIPO='MAQ' THEN A.COSTO ELSE 0 END) ,2) AS comsMaq
            ,ROUND(SUM(CASE WHEN A.TIPO IN('AJU','CIM','CIS','MER','RMC','VIR','OIM') THEN A.SALDO ELSE 0 END) ,3) AS movsUni
            ,ROUND(SUM(CASE WHEN A.TIPO IN('AJU','CIM','CIS','MER','RMC','VIR','OIM') THEN A.COSTO ELSE 0 END) ,2) AS movsCosto
            ,ROUND(SUM(CASE WHEN A.TIPO='DEC' THEN A.SALDO ELSE 0 END) ,3) AS decUni
            ,ROUND(SUM(CASE WHEN A.TIPO='DEC' THEN A.COSTO ELSE 0 END) ,2) AS decCosto
            ,ROUND(SUM(CASE WHEN A.TIPO IN('TPE','TPS') THEN A.SALDO ELSE 0 END) ,3) AS trasladosUni
            ,ROUND(SUM(CASE WHEN A.TIPO IN('TPE','TPS') THEN A.COSTO ELSE 0 END) ,2) AS trasladosCosto
            ,ROUND(SUM(CASE WHEN A.TIPO IN('SRE','STR','SMA') THEN A.SALDO ELSE 0 END) ,3) AS trsSalUni
            ,ROUND(SUM(CASE WHEN A.TIPO IN('SRE','STR','SMA') THEN A.COSTO ELSE 0 END) ,2) AS trsSalCosto
            ,ROUND(SUM(CASE WHEN A.TIPO IN('ERE','ETR','EMA') THEN A.SALDO ELSE 0 END) ,3) AS trsEntUni
            ,ROUND(SUM(CASE WHEN A.TIPO IN('ERE','ETR','EMA') THEN A.COSTO ELSE 0 END) ,2) AS trsEntCosto
            ,ROUND(SUM(CASE WHEN A.TIPO='RMD' THEN A.SALDO ELSE 0 END) ,3) AS devUni
            ,ROUND(SUM(CASE WHEN A.TIPO='RMD' THEN A.COSTO ELSE 0 END) ,2) AS devCosto
            ,ROUND(SUM(CASE WHEN A.TIPO='FAC' THEN A.SALDO ELSE 0 END) ,3) AS vtaUni
            ,ROUND(SUM(CASE WHEN A.TIPO='FAC' THEN A.COSTO ELSE 0 END) ,2) AS vtaCosto
            ,ROUND(SUM(CASE WHEN A.TIPO='FIN' THEN A.SALDO ELSE 0 END) ,3) AS saldo
            ,ROUND(SUM(CASE WHEN A.TIPO='FIN' THEN A.COSTO ELSE 0 END) ,2) AS costo
            ,IFNULL((SELECT CP.COSTO FROM costo_promedio CP WHERE CP.producto_id=X.ID and CP.EJERCICIO = @EJERCICIO AND CP.MES = @MES),0) AS costop
            FROM (      
                SELECT 'REDONDEO' ASIENTO,'INI' AS TIPO,'01 A_INV' AS GRUPO,s.sw2,s.clave SUC,s.nombre SUCURSAL,P.CLAVE,P.DESCRIPCION,ROUND(   (I.EXISTENCIA_INICIAL/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),3) as KILOS
               ,ROUND(   (I.EXISTENCIA_INICIAL/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO,   (   (I.EXISTENCIA_INICIAL/(case when p.unidad ='MIL' then 1000 else 1 end) * I.COSTO )  ) as COSTO
               ,'' PROVEEDOR,CONCAT('115-0001-',(CASE WHEN s.sw2<10 THEN '000' ELSE '00' END),s.clave,'-0000') CTA_CONTABLE
               FROM existencia i join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id) where p.inventariable is true and I.ANIO= @EJERCICIO AND I.MES = @MES  AND I.CLAVE LIKE '%'         
                union
               SELECT 'REDONDEO' ASIENTO,'FIN' AS TIPO,'08 Z_INV' AS GRUPO,s.sw2,s.clave SUC,s.nombre SUCURSAL,P.CLAVE,P.DESCRIPCION
               ,ROUND(   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),3) as KILOS
               ,ROUND(   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO,   (   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * I.COSTO_PROMEDIO )  ) as COSTO
               ,'' PROVEEDOR,CONCAT('115-0001-',(CASE WHEN s.sw2<10 THEN '000' ELSE '00' END),s.clave,'-0000') CTA_CONTABLE
               FROM existencia i join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id) where p.inventariable is true and I.ANIO= @EJERCICIO AND I.MES = @MES  AND I.CLAVE LIKE '%'         
                union              
                SELECT 'FLETES PROVEEDOR' ASIENTO,'FLT' TIPO,'02 COMPRAS' AS grupo,s.sw2,S.clave SUC,S.NOMBRE SUCURSAL,P.CLAVE,P.DESCRIPCION 
                ,0 as kilos,0 as saldo,   ( (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * i.gasto) ) as COSTO
                ,(select x.nombre from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventario_id=i.id  ) PROVEEDOR        
                ,concat('115-0004-',(SELECT o.cuenta_operativa FROM recepcion_de_compra_det d   join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id) join cuenta_operativa_proveedor o on(o.proveedor_id=x.id) where d.inventario_id=i.id ),'-0000') CTA_CONTABLE
                from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
                where p.inventariable is true and  YEAR(I.FECHA)= @EJERCICIO AND MONTH(I.FECHA) = @MES
                AND I.TIPO IN('COM') AND I.GASTO>0
                  union
                SELECT 'MAQUILA PROVEEDOR' ASIENTO,'MAQ' TIPO,'02 COMPRAS' AS grupo,s.sw2,S.clave SUC,S.NOMBRE SUCURSAL,P.CLAVE,P.DESCRIPCION 
                ,0 as kilos,0 as saldo,   ( (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * i.gasto) ) as COSTO
                ,(select x.nombre from transformacion_det d join analisis_de_transformacion_det a on(d.id=a.trs_id) join analisis_de_transformacion t on(a.analisis_id=t.id) join proveedor x on(t.proveedor_id=x.id) where d.inventario_id=i.id  ) PROVEEDOR                
                ,concat('115-0011-'
                ,(select o.cuenta_operativa from transformacion_det d join analisis_de_transformacion_det a on(d.id=a.trs_id) join analisis_de_transformacion t on(a.analisis_id=t.id) join proveedor x on(t.proveedor_id=x.id) join cuenta_operativa_proveedor o on(o.proveedor_id=x.id) where d.inventario_id=i.id  )
                ,(CASE WHEN S.CLAVE<10 THEN '-000' ELSE '-00' END),S.CLAVE
                ) CTA_CONTABLE
                from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
                where p.inventariable is true and  YEAR(I.FECHA)= @EJERCICIO AND MONTH(I.FECHA) = @MES
                AND I.CLAVE LIKE '%'
                AND I.TIPO IN('MAQ') AND I.GASTO>0 
                    union           
                select a.ASIENTO,a.TIPO,a.GRUPO,a.sw2,a.SUC,a.SUCURSAL,a.CLAVE,a.DESCRIPCION,SUM(a.KILOS) KILOS,SUM(a.SALDO) SALDO,SUM(a.COSTO) COSTO,a.PROVEEDOR,a.CTA_CONTABLE 
                from (        
                SELECT (CASE WHEN i.TIPO IN('COM','DEC') AND I.COSTO=0 THEN 'COMPRAS_SNA'
                WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN 'COMPRAS'
                WHEN i.TIPO IN('DEC') THEN 'COMPRAS'
                WHEN i.TIPO IN('FAC') THEN 'COSTO DE VENTA'
                WHEN i.TIPO IN('RMD') THEN 'DEVOLUCION'
                WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD>0 THEN 'MOVTOS DE ALMACEN OPRD'
                WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD<0 THEN 'MOVTOS DE ALMACEN OGST'
                WHEN i.TIPO IN('TRS','REC','MAQ') THEN 'TRANSFORMACIONES'
                WHEN i.TIPO IN('TPS') THEN 'TRASLADOS_SALIDA' 
                WHEN i.TIPO IN('TPE') THEN 'TRASLADOS_ENTRADA' 
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PAPELERIA' THEN 'PAPELERIA Y COPIAS'
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='MATERIAL_EMPAQUE' THEN 'MATERIAL DE EMPAQUE'
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PUBLICIDAD_PROPAGANDA' THEN 'PUBLICIDAD PROPAGANDA'
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='NO_DEDUSIBLE' THEN 'NO DEDUCIBLE'
                ELSE TIPO END) ASIENTO
                ,(CASE WHEN i.TIPO IN('COM','DEC') AND I.COSTO=0 THEN 'SNA' WHEN i.TIPO IN('TRS','REC','MAQ') AND I.CANTIDAD>0 THEN concat('E',SUBSTR(i.tipo,1,2)) WHEN i.TIPO IN('TRS','REC','MAQ') AND I.CANTIDAD<0 THEN concat('S',SUBSTR(i.tipo,1,2)) ELSE TIPO END) AS TIPO
                ,(CASE WHEN I.TIPO IN('COM','DEC') THEN '02 COMPRAS' WHEN I.TIPO IN('AJU','CIM','CIS','MER','RMC') THEN '03 GASTO' WHEN I.TIPO IN('VIR','OIM') THEN '04 PRODUCTO'
                 WHEN I.TIPO IN('REC','TRS','MAQ') THEN '05 TRANSFORM' 
                 WHEN I.TIPO IN('TPS') THEN '06 TRASLADO_SALIDA'
                 WHEN I.TIPO IN('TPE') THEN '06 TRASLADO_ENTRADA'
                 WHEN I.TIPO IN('FAC','RMD') THEN '07 VENTAS' ELSE 'OTROS' END) AS GRUPO,s.sw2,S.clave SUC,S.NOMBRE SUCURSAL,P.CLAVE,P.DESCRIPCION
                ,ROUND(   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),3) as KILOS,ROUND(   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO
                ,    (   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.tipo IN('COM','DEC') and i.costo>0 then i.costo when i.TIPO IN('TRS','REC','MAQ') AND I.CANTIDAD>0 then i.costo else I.COSTO_promedio end)) ) as COSTO
                ,(CASE WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN (select x.nombre from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventario_id=i.id  )
                 WHEN i.TIPO IN('DEC') AND I.costo>0 THEN (select x.nombre from devolucion_de_compra_det d join devolucion_de_compra r on(d.devolucion_de_compra_id=r.id) join proveedor x on(r.proveedor_id=x.id) where d.inventario_id=i.id  )
                 ELSE '' END) AS PROVEEDOR
                ,(CASE WHEN i.TIPO IN('COM','DEC') AND I.COSTO=0 THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
                WHEN i.TIPO IN('COM') AND I.COSTO>0 THEN CONCAT('115-',(select (case when x.cuenta_operativa in('0061','0038') then concat('0002-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) from recepcion_de_compra_det d join recepcion_de_compra r on(d.recepcion_id=r.id) join cuenta_operativa_proveedor x on(r.proveedor_id=x.proveedor_id) where d.inventario_id=i.id  ),'-0000')
                WHEN i.TIPO IN('DEC') THEN CONCAT('115-',(select (case when x.cuenta_operativa in('0061','0038') then concat('0005-',x.cuenta_operativa) else concat('0006-',x.cuenta_operativa) end) from devolucion_de_compra_det d join devolucion_de_compra r on(d.devolucion_de_compra_id=r.id) join cuenta_operativa_proveedor x on(r.proveedor_id=x.proveedor_id) where d.inventario_id=i.id  ),'-0000')
                WHEN i.TIPO IN('FAC') THEN CONCAT('501-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
                WHEN i.TIPO IN('RMD') THEN CONCAT('501-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
                WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD>0 THEN '704-0005-0000-0000'
                WHEN i.TIPO IN('AJU','CIM','MER','RMC','OIM','VIR') AND I.CANTIDAD<0 THEN CONCAT('600-0031-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
                WHEN i.TIPO IN('TRS','REC','MAQ') THEN CASE WHEN  (   (I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.tipo='COM' and i.costo>0 then i.costo when i.TIPO IN('TRS','REC','MAQ') AND I.CANTIDAD>0 then i.costo else I.COSTO_promedio end))  )>0 THEN '704-0005-0000-0000' ELSE '703-0001-0000-0000' END
                WHEN i.TIPO IN('TPS') THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000') 
                WHEN i.TIPO IN('TPE') THEN CONCAT('115-0001-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000') 
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PAPELERIA' THEN CONCAT('600-0032-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='MATERIAL_EMPAQUE' THEN CONCAT('600-0029-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='PUBLICIDAD_PROPAGANDA' THEN CONCAT('600-0033-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000')
                WHEN i.TIPO IN('CIS') AND (SELECT d.tipocis FROM movimiento_de_almacen m join movimiento_de_almacen_det d on(d.movimiento_de_almacen_id=m.id) where d.inventario_id=i.id)='NO_DEDUSIBLE' THEN CONCAT('600-0031-',(CASE WHEN S.CLAVE<10 THEN '000' ELSE '00' END),S.CLAVE,'-0000') ELSE TIPO END) CTA_CONTABLE
                from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
                where p.inventariable is true and  YEAR(I.FECHA)= @EJERCICIO AND MONTH(I.FECHA) = @MES AND I.CLAVE LIKE '%'           
                ) as a       
                group by 1,2,6,7,12                  
            ) AS A 
            JOIN PRODUCTO X ON(X.CLAVE=A.CLAVE)
            LEFT JOIN LINEA L ON(X.LINEA_ID=L.ID)
            LEFT JOIN CLASE C ON(X.CLASE_ID=C.ID)
            LEFT JOIN MARCA M ON(X.MARCA_ID=M.ID)
            where x.inventariable=true  
            and ( ( (case when saldo<0 then abs(saldo) else 0 end) + (case when saldo>0 then saldo else 0 end) ) > 0  or (A.TIPO in('FLT','MAQ')) )
            GROUP BY 1 ORDER BY 1

        """
    }

    def getLocalRows(String sql, List params) {
        def db = getLocalSql()
        try {
            return db.rows(sql, params)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }



    Sql getLocalSql(){
        Sql sql = new Sql(this.dataSource)
        return sql
    }
}
