package sx.compras


import groovy.sql.Sql
import java.sql.SQLException

import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import grails.compiler.GrailsCompileStatic


import sx.core.LogUser
import sx.core.Sucursal

@GrailsCompileStatic
@Slf4j
class IntegracionDeComprasService implements LogUser {

	private List<Sucursal> _sucursales

	/**
	* 
	**/
	void actualizarDepuracion() {
		List compras = Compra.where{sucursal.nombre == 'OFICINAS'}.list([max: 10, sort: 'fecha', order: 'asc'])
		Compra.findAll('select c.id from Compra c where c.sucursal.nombre = ? ', [])
		getSucursales().each { sucursal ->
			log.info('Evaluando: {}', sucursal.nombre)
			log.info('Compras: {}', compras.collect{it.id}.join(','))
			

		}
		/*
		def sucursales = Sucursal.where{dbUrl != null && activa == true && almacen == true}.list()
			sucursales.each {
    			println "${it} ${it.dbUrl} Almacen: ${it.almacen}"
			}
		*/
	}

	List rows(String dbUrl, String sql, List params) {
        def db = getSql(dbUrl)
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

	Sql getSql(String dbUrl) {
        String user = 'root'
        String password = 'sys'
        String driver = 'com.mysql.jdbc.Driver'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }


	List<Sucursal> getSucursales() {
		if(!_sucursales)
			_sucursales = Sucursal.where{dbUrl != null && activa == true && almacen == true}.list()
		return _sucursales
	}
}