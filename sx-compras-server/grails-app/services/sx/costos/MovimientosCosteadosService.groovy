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

    static String MOVIMIENTOS_SQL = """
    SELECT A.CLAVE as clave ,x.de_linea as deLinea,A.DESCRIPCION as descripcion ,L.LINEA as linea, C.CLASE as clase, M.MARCA as marca 
    ,SUM(CASE WHEN A.TIPO='INI' THEN A.SALDO ELSE 0 END) AS saldoInicial
    ,SUM(CASE WHEN A.TIPO='INI' THEN A.COSTO ELSE 0 END) AS costoInicial
    ,SUM(CASE WHEN A.TIPO='SNA' THEN A.SALDO ELSE 0 END) AS comsSinAUni
    ,SUM(CASE WHEN A.TIPO='SNA' THEN A.COSTO ELSE 0 END) AS comsSinA
    ,SUM(CASE WHEN A.TIPO='COM' THEN A.SALDO ELSE 0 END) AS comsUni
    ,SUM(CASE WHEN A.TIPO='COM' THEN A.COSTO ELSE 0 END) AS comsCosto
    ,SUM(CASE WHEN A.TIPO IN('AJU','CIM','CIS','MER','RMC''VIR','OIM') THEN A.SALDO ELSE 0 END) AS movsUni
    ,SUM(CASE WHEN A.TIPO IN('AJU','CIM','CIS','MER','RMC''VIR','OIM') THEN A.COSTO ELSE 0 END) AS movsCosto
    ,SUM(CASE WHEN A.TIPO='DEC' THEN A.SALDO ELSE 0 END) AS decUni
    ,SUM(CASE WHEN A.TIPO='DEC' THEN A.COSTO ELSE 0 END) AS decCosto
    ,SUM(CASE WHEN A.TIPO IN('TPE','TPS') THEN A.SALDO ELSE 0 END) AS trasladosUni
    ,SUM(CASE WHEN A.TIPO IN('TPE','TPS') THEN A.COSTO ELSE 0 END) AS trasladosCosto
    ,SUM(CASE WHEN A.TIPO IN('SRE','STR') THEN A.SALDO ELSE 0 END) AS trsSalUni
    ,SUM(CASE WHEN A.TIPO IN('SRE','STR') THEN A.COSTO ELSE 0 END) AS trsSalCosto
    ,SUM(CASE WHEN A.TIPO IN('ERE','ETR') THEN A.SALDO ELSE 0 END) AS trsEntUni
    ,SUM(CASE WHEN A.TIPO IN('ERE','ETR') THEN A.COSTO ELSE 0 END) AS trsEntCosto
    ,SUM(CASE WHEN A.TIPO='RMD' THEN A.SALDO ELSE 0 END) AS devUni
    ,SUM(CASE WHEN A.TIPO='RMD' THEN A.COSTO ELSE 0 END) AS devCosto
    ,SUM(CASE WHEN A.TIPO='FAC' THEN A.SALDO ELSE 0 END) AS vtaUni
    ,SUM(CASE WHEN A.TIPO='FAC' THEN A.COSTO ELSE 0 END) AS vtaCosto
    ,SUM(CASE WHEN A.TIPO='FIN' THEN A.SALDO ELSE 0 END) AS saldo
    ,SUM(CASE WHEN A.TIPO='FIN' THEN A.COSTO ELSE 0 END) AS costo
    ,IFNULL((SELECT CP.COSTO FROM costo_promedio CP WHERE CP.producto_id=X.ID and CP.EJERCICIO = ? AND CP.MES = ?),0) AS costop
    FROM ( 
    select (CASE WHEN i.TIPO IN('TRS','REC') AND I.CANTIDAD>0 THEN concat('E',SUBSTR(i.tipo,1,2)) WHEN i.TIPO IN('TRS','REC') AND I.CANTIDAD<0 THEN concat('S',SUBSTR(i.tipo,1,2)) ELSE TIPO END) AS TIPO
    ,P.CLAVE,P.DESCRIPCION,S.SW2,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),0) as KILOS,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO
    ,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * (case when i.TIPO IN('TRS','REC','COM') AND I.CANTIDAD>0 then i.costo+i.gasto else I.COSTO_promedio end)),2) as COSTO
    from inventario I  join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id)
    where p.inventariable is true and YEAR(I.FECHA)= ? AND MONTH(I.FECHA) = ? group by 1,2
    UNION
    SELECT 'INI' AS TIPO,P.CLAVE,P.DESCRIPCION,s.sw2,ROUND(SUM(I.EXISTENCIA_INICIAL/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),0) as KILOS
    ,ROUND(SUM(I.EXISTENCIA_INICIAL/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO,ROUND(SUM(I.EXISTENCIA_INICIAL/(case when p.unidad ='MIL' then 1000 else 1 end) * I.COSTO ),2) as COSTO
    FROM existencia i join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id) where p.inventariable is true and I.ANIO= ? AND I.MES = ?  group by 1,2
    UNION
    SELECT 'FIN' AS TIPO,P.CLAVE,P.DESCRIPCION,s.sw2,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)*P.KILOS),0) as KILOS
    ,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end)),3) as SALDO,ROUND(SUM(I.CANTIDAD/(case when p.unidad ='MIL' then 1000 else 1 end) * I.costo_promedio ),2) as COSTO
    FROM existencia i join producto p on(p.id=i.producto_id) JOIN sucursal s on(i.sucursal_id=s.id) where p.inventariable is true and I.ANIO= ? AND I.MES = ?  group by 1,2
    ) AS A 
    JOIN PRODUCTO X ON(X.CLAVE=A.CLAVE)
    LEFT JOIN LINEA L ON(X.LINEA_ID=L.ID)
    LEFT JOIN CLASE C ON(X.CLASE_ID=C.ID)
    LEFT JOIN MARCA M ON(X.MARCA_ID=M.ID)
    where x.inventariable=true  
    and ( (case when saldo<0 then abs(saldo) else 0 end) + (case when saldo>0 then saldo else 0 end) ) > 0
    GROUP BY 1 ORDER BY 1 
    """
    def movimientos(Integer ejercicio, Integer mes) {
        return getLocalRows(MOVIMIENTOS_SQL, [ejercicio, mes, ejercicio, mes, ejercicio, mes, ejercicio, mes])
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
