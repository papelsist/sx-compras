package sx.integracion

import java.sql.SQLException

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils

import org.springframework.stereotype.Component

import sx.utils.Periodo


@Slf4j
@Component("importadorDeFacturasDeImportacion")
class ImportadorDeFacturasDeImportacion {


    def importar(Periodo periodo) {

    }

    

    def getRows(String sql) {
        def db = getSql()
        try {
            return db.rows(sql)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }


    def getSql() {
        String user = 'root'
        String password = 'sys'
        String driver = 'com.mysql.jdbc.Driver'
        String dbUrl = 'jdbc:mysql://10.10.1.229/sx_rh'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }


}

/*

   
// Importar Cfdis de Impap y PaperImports

import groovy.sql.*
import java.sql.SQLException

import org.apache.commons.lang.exception.ExceptionUtils
File dir = new File('/home/cfdProv')
assert dir.exists()
getRows(getMasterSql()).each { row ->
   Byte[] xml = row.xml
   File target = new File(dir,row.xml_name)
   target.write(new String(xml), 'UTF-8')
}


def getRows(String select) {
    def db = getSql()
    try {
        return db.rows(select,
                       [Date.parse('dd/MM/yyyy', '01/08/2019'), 
                        Date.parse('dd/MM/yyyy', '12/08/2019')
                       ])
    }catch (SQLException e){
        def c = ExceptionUtils.getRootCause(e)
        def message = ExceptionUtils.getRootCauseMessage(e)
        println message
    }finally {
        db.close()
    }
}

def getSql() {
    String user = 'root'
    String password = 'sys'
    String driver = 'com.mysql.jdbc.Driver'
    String dbUrl = 'jdbc:mysql://10.10.1.228/impapx2'
    Sql db = Sql.newInstance(dbUrl, user, password, driver)
    return db
}

def getMasterSql(){
    return """
            select
            *
            from cfdi where date(date_created) between ?  and ? and receptor_rfc = 'PAP830101CR3'
        """
}

*/
