package sx.contabilidad

import grails.gorm.transactions.Transactional
import groovy.sql.Sql
import org.apache.commons.lang3.exception.ExceptionUtils
import java.sql.SQLException
import groovy.util.logging.Slf4j

@Slf4j
@Transactional
class AuxiliaresService {

    def dataSource

    String getSelect(tipo){
        def select = ""
        switch(tipo) {
            case 'BANCOS':
            return select = """
            SELECT 
                    month(p.fecha) as mes,
                    year(p.fecha ) as ejercicio,
                    p.folio as poliza,p.fecha,p.tipo,p.subtipo,d.asiento,d.descripcion as concepto
                    ,d.sucursal
                    ,(d.debe) as debe,(d.haber) as haber
                    ,c.clave,c.descripcion
                    FROM poliza_det d  join poliza p on (p.id=d.poliza_id) join cuenta_contable c on (c.id= d.cuenta_id)
                    where  
                    p.fecha between '@FECHA_INICIAL' and '@FECHA_FINAL'
                    and c.id = '@CUENTA'
                    AND p.subtipo not like 'COBRANZA_%'
                    union
                    SELECT 
                    month(p.fecha) as mes,
                    year(p.fecha ) as ejercicio,
                    p.folio as poliza,p.fecha,p.tipo,p.subtipo,d.asiento,d.descripcion as concepto
                    ,d.sucursal
                    ,sum(d.debe) as debe,sum(d.haber) as haber
                    ,c.clave,c.descripcion
                    FROM poliza_det d  join poliza p on (p.id=d.poliza_id) join cuenta_contable c on (c.id= d.cuenta_id)
                    where  
                    p.fecha between '@FECHA_INICIAL'  and '@FECHA_FINAL'
                    and c.id = '@CUENTA'
                    and d.asiento not like 'COB_DEP_%' AND d.asiento not like 'COB_TRANSF_%' AND d.asiento not like 'COB_FICHA_CHE%'
                    AND p.subtipo like 'COBRANZA_%'
                    GROUP by c.id,asiento,p.subtipo,d.sucursal
                    UNION
                    SELECT 
                    month(p.fecha) as mes,
                    year(p.fecha ) as ejercicio,
                    p.folio as poliza,p.fecha,p.tipo,p.subtipo,d.asiento,d.descripcion as concepto
                    ,d.sucursal
                    ,d.debe as debe,(d.haber) as haber
                    ,c.clave,c.descripcion
                    FROM poliza_det d  join poliza p on (p.id=d.poliza_id) join cuenta_contable c on (c.id= d.cuenta_id)
                    where  
                    p.fecha between '@FECHA_INICIAL' and '@FECHA_FINAL'
                    and c.id = '@CUENTA'
                    and (d.asiento like 'COB_DEP_%' OR d.asiento  like 'COB_TRANSF_%' OR d.asiento  like 'COB_FICHA_CHE%')
                    AND p.subtipo like 'COBRANZA_%'
                    order by 2,3,4,6,5
            """
            break
            case 'GENERAL':
            return select = """
                    SELECT month(p.fecha) as mes ,year(p.fecha) as ejercicio,'B' orden,(SELECT z.clave  FROM cuenta_contable x join cuenta_contable y on(x.padre_id=y.id) join cuenta_contable z on(y.padre_id=z.id) where x.id=c.padre_id and  z.nivel=c.nivel-3 ) as clave_1,   
                    (SELECT z.descripcion  FROM cuenta_contable x join cuenta_contable y on(x.padre_id=y.id) join cuenta_contable z on(y.padre_id=z.id) where x.id=c.padre_id and  z.nivel=c.nivel-3 ) as descripcion_1,   
                    (SELECT y.clave  FROM cuenta_contable x join cuenta_contable y on(x.padre_id=y.id) where x.id=c.padre_id and x.padre_id is not null and y.nivel=c.nivel-2 ) as clave_2, 
                    (SELECT y.descripcion  FROM cuenta_contable x join cuenta_contable y on(x.padre_id=y.id) where x.id=c.padre_id and x.padre_id is not null and y.nivel=c.nivel-2 ) as descripcion_2, 
                    (SELECT x.clave  FROM cuenta_contable x where x.id=c.padre_id and x.nivel=c.nivel-1 ) as clave_3,
                    (SELECT x.descripcion  FROM cuenta_contable x where x.id=c.padre_id and x.nivel=c.nivel-1 ) as descripcion_3,
                    c.clave,c.descripcion,0 saldo_inicial,s.debe,s.haber,
                    p.folio,(case when p.tipo='DIARIO' then 'Dr-' when p.tipo='INGRESO' then 'Ig-' else 'Eg-' end) tipo,p.subtipo,p.fecha,s.descripcion
                    ,(SELECT saldo_inicial FROM saldo_por_cuenta_contable s join cuenta_contable c on(s.cuenta_id=c.id)
                    where c.id=449 and s.ejercicio=year(p.fecha) and s.mes=month(p.fecha)) as saldo_ini
                    ,(SELECT saldo_final FROM saldo_por_cuenta_contable s join cuenta_contable c on(s.cuenta_id=c.id)
                    where c.id=449 and s.ejercicio=year(p.fecha) and s.mes=month(p.fecha)) as saldo_fin
                    FROM poliza_det s join cuenta_contable c on(s.cuenta_id=c.id) join poliza p on(s.poliza_id=p.id)
                    where c.id=449 
                    and p.fecha  BETWEEN '2018/01/25' and '2018/02/15'
                    order by p.fecha
            """
        
        }
    }

    Sql getSql(){
        return new Sql(dataSource)
    }


    List getAllRows(String sql,def params){
        Sql db = getSql()
        try {
            return db.rows(sql,params)
        }catch (SQLException e){
            Throwable c = ExceptionUtils.getRootCause(e)
            String message = ExceptionUtils.getRootCauseMessage(e)
            log.error(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

    String toSqlDate(Date date){
        return date.format('yyyy-MM-dd')
    }
}
