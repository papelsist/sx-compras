package sx.logistica

import java.sql.SQLException

import groovy.sql.Sql
import groovy.util.logging.Slf4j

import org.apache.commons.lang.exception.ExceptionUtils

import sx.core.Sucursal
import sx.utils.Periodo

@Slf4j
class InventarioService {

	def dataSource

	def existenciasCrossTab() {
		def sucursales = Sucursal.findAllByActiva(true)
		Integer ejercicio = Periodo.currentYear()
        Integer mes = Periodo.currentMes()
		String buff = ""
		sucursales.each{sucursal ->  
    		buff <<= " ,SUM(CASE WHEN SUCURSAL_NOMBRE = '${sucursal.nombre}' THEN CANTIDAD ELSE 0 END )AS '${sucursal.nombre}' "
		}

		String queryExist ="""
			SELECT 
				P.CLAVE as clave,
			 	P.DESCRIPCION as descripcion,
			 	p.UNIDAD as unidad,
			 	p.KILOS as kilos,
			 	p.GRAMOS as gramos,
			 	l.linea as linea,
			 	SUM(CANTIDAD) as cantidad
			@CASE
			FROM 
			(
				SELECT producto_id,CLAVE,sucursal_nombre,CANTIDAD
				FROM existencia E  
				where anio = ? and e.mes = ? 
			) as x 
			JOIN producto P ON (P.ID = X.PRODUCTO_ID )
			LEFT JOIN linea l on (p.linea_id = l.id)
			GROUP BY producto_id
			ORDER BY p.clave
			"""

		String select = queryExist.replaceAll("@CASE", buff)
		// log.info('SQL: {}', select)
		return leerRegistros(select, [ejercicio, mes])

	}

	def List leerRegistros(String sql,List params){
        Sql db = getSql()
        try {
            return db.rows(sql,params)
        }catch (SQLException e){
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            log.error(message, c)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }


	Sql getSql(){
       return new Sql(dataSource)
    }


}