package sx.contabilidad

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

import java.sql.SQLException

@Slf4j
trait SqlAccess {

    @Autowired
    @Qualifier('dataSource')
    def dataSource

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

    Sql getSql(){
        return new Sql(dataSource)
    }

}