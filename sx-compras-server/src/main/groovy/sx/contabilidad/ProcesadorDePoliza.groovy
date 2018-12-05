package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import groovy.sql.Sql
import groovy.util.logging.Slf4j

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

import org.apache.commons.lang3.exception.ExceptionUtils


import java.sql.SQLException

@Slf4j
// @GrailsCompileStatic
trait ProcesadorDePoliza {

    @Autowired
    @Qualifier('dataSource')
    def dataSource

    String definirConcepto(Poliza poliza){
        return "${poliza.tipo} ${poliza.subtipo} ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    Poliza recalcular(Poliza poliza) {
        log.info('Recalculando poliza {}', poliza)
        return poliza
    }

    List getAllRows(String sql,List params){
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

    Map  getRow(String sql, List params){
        Sql db = getSql()
        try {
            return db.firstRow(sql, params)
        }catch (SQLException e){
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            log.error(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

    String toSqlDate(Date date){
        return date.format('yyyy-MM-dd')
    }

    Sql getSql(){
        return new Sql(dataSource)
    }

}