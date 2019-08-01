package sx.compras

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.core.Proveedor
import sx.core.Producto
import sx.utils.Periodo


@Transactional
@GrailsCompileStatic
@Slf4j
class ListaDePreciosVentaService implements LogUser {

    ListaDePreciosVenta save(ListaDePreciosVenta lista) {
    	log.debug("Salvando lista de precios venta {}", lista)
        logEntity(lista)
        lista.save failOnError: true, flush: true
        return lista

    }

    ListaDePreciosVenta update(ListaDePreciosVenta lista) {
    	log.debug("Actualizando lista de precios venta {}", lista)
        lista.partidas.each {
        	logEntity(it)
        }
        logEntity(lista)
        lista.save failOnError: true, flush: true
        return lista

    }

    ListaDePreciosVenta aplicar(ListaDePreciosVenta lista) {
    	
    }

    List disponibles() {
        Integer year = Periodo.currentYear()
        Integer mes = Periodo.currentMes()
        if(mes == 1) {
            mes = 12
            year = year - 1
        } else {
            mes = mes - 1
        }
        List rows = Producto.findAll(
            """select new sx.compras.ListaProdDto(
            p.clave,
            p.descripcion,
            p.linea.linea,
            p.marca.marca,
            p.clase.clase,
            p.precioCredito as precioAnteriorCredito,
            p.precioContado as precioAnteriorContado,
            cast(0.0 as big_decimal) as precioCredito,
            cast(0.0 as big_decimal) as precioContado,
            case when (select x.costo from CostoPromedio x where x.producto.id = p.id and x.ejercicio = ? and x.mes = ?) is null then cast(0.0 as big_decimal) end as costo,
            p.proveedorFavorito as proveedor)
            from Producto p 
            where p.activo = true 
              and p.deLinea = true
            """,
            [year, mes])

        return rows
    }

    // 0.00 as precioCredito,
    // 0.00 as precioContado,
    
}