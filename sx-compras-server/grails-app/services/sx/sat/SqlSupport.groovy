package sx.sat

import groovy.sql.GroovyRowResult
import groovy.sql.Sql
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.beans.factory.annotation.Autowired

import javax.sql.DataSource
import java.sql.SQLException

@Slf4j
@CompileStatic
trait SqlSupport {

    @Autowired
    DataSource dataSource

    List<GroovyRowResult> getRows(Sql db, String sql, ...params) {
        try {
            return db.rows(sql, params)
        }catch (SQLException e){
            // e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            // log.debug(message)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

    List<GroovyRowResult> getRows(Sql db, String sql) {
        try {
            return db.rows(sql)
        }catch (SQLException e){
            // e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            // log.debug(message)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

    Sql getRawSql(String dbUrl, String user, String password) {
        String driver = 'com.mysql.jdbc.Driver'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }

    Sql getLocalSql() {
        return new Sql(this.dataSource);
    }



}