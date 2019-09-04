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

	def alcanceSimpleCrossTab(int meses ) {
		log.info('Alcance simple para {} meses', meses)
		def sucursales = Sucursal.where{dbUrl != null && activa == true && almacen == true}.list()
		Integer ejercicio = Periodo.currentYear()
        Integer mes = Periodo.currentMes()
		String fromExistencia = ""
		sucursales.each{sucursal ->  
    		fromExistencia <<= " ,SUM(CASE WHEN SUCURSAL_NOMBRE = '${sucursal.nombre}' AND TIPO = 'INV' THEN CANTIDAD ELSE 0 END )AS '${sucursal.nombre}_INV' " +
    						   " ,SUM(CASE WHEN SUCURSAL_NOMBRE = '${sucursal.nombre}' AND TIPO = 'VTA' THEN CANTIDAD ELSE 0 END ) / ${meses} AS '${sucursal.nombre}_VTA' "
		}
		

		String query ="""
			SELECT 
				P.CLAVE as clave,
			 	P.DESCRIPCION as descripcion,
			 	P.UNIDAD as unidad,
			 	P.KILOS as kilos,
			 	L.LINEA as linea,
			 	SUM(CANTIDAD) as cantidad
				@CASE
					FROM 
					(
						SELECT 'INV' tipo,producto_id, P.CLAVE, sucursal_nombre, (E.CANTIDAD/(CASE WHEN P.UNIDAD='MIL' THEN 1000 ELSE 1 END) ) CANTIDAD
						FROM existencia E   JOIN producto P ON(P.ID=E.PRODUCTO_ID) 
						WHERE anio = ? and e.mes = ?
						union						
						SELECT 'VTA' tipo,d.producto_id,p.clave,s.nombre sucursal_nombre,SUM(D.CANTIDAD/(CASE WHEN P.UNIDAD='MIL' THEN 1000 ELSE 1 END) )  AS CANTIDAD
						FROM venta_det D join venta v on(v.id=d.venta_id) JOIN producto P ON(P.ID=D.PRODUCTO_ID) JOIN sucursal S ON(S.ID=D.SUCURSAL_ID) 
						join cuenta_por_cobrar c on(c.id=v.cuenta_por_cobrar_id)
						WHERE c.fecha BETWEEN ? and ? and d.inventario_id is not null and c.cfdi_id is not null and c.cancelada is null
						GROUP BY P.id,s.id
					) as x 
			JOIN producto P ON (P.ID = X.PRODUCTO_ID )
			LEFT JOIN linea l on (p.linea_id = l.id)
			GROUP BY producto_id  HAVING SUM(CASE WHEN TIPO='INV' THEN CANTIDAD ELSE 0 END) + SUM(CASE WHEN TIPO='VTA' THEN CANTIDAD ELSE 0 END) <>0
			ORDER BY p.clave
			"""

		String select = query.replaceAll("@CASE", fromExistencia)
		Date fin = new Date()
		def dias = 30 * meses
		Date inicio = fin - dias
		return leerRegistros(select, [ejercicio, mes, inicio, fin])

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

