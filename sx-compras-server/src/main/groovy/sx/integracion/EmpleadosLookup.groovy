package sx.integracion

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.stereotype.Component
import sx.tesoreria.PagoDeNomina

import java.sql.SQLException

@Slf4j
@Component("empleadosLookup")
class EmpleadosLookup {

    String selectCajeras() {
        return """
            select concat(e.nombres, ' ' , e.apellido_paterno, ' ', e.apellido_materno) as nombre, 
                p.numero_de_trabajador * 1 as numeroDeTrabajador, 
                x.clave as puesto, 
                u.clave as sucursal, 
                e.status
            from empleado e
            join perfil_de_empleado p on(e.id = p.empleado_id)
            join puesto x on (x.id = p.puesto_id)
            join ubicacion u on (u.id = p.ubicacion_id)
            where x.clave like '%CAJ%' 
              and concat(e.nombres, ' ' , e.apellido_paterno, ' ', e.apellido_materno) like '%@TERM%'
        """
    }


    def findCajeras(String term) {
        def select = selectCajeras()
        select = select.replaceAll('@TERM', term.toUpperCase())
        return getRows(select)
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
