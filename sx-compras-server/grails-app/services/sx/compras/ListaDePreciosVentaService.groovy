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
    	log.debug("Salvando lista de precios venta {}", lista.id)
        logEntity(lista)
        lista.save failOnError: true, flush: true
        return lista

    }

    ListaDePreciosVenta update(ListaDePreciosVenta lista) {
    	log.debug("Actualizando lista de precios venta {}", lista.id)
        lista.partidas.each {
        	logEntity(it)
        }
        logEntity(lista)
        lista.save failOnError: true, flush: true
        return lista

    }

    ListaDePreciosVenta aplicar(ListaDePreciosVenta lista) {
    	lista.partidas.each { item ->
            Producto producto = item.producto
            boolean doSave = false
            if (item.precioContado > 0.0 ) {
                producto.precioContado = item.precioContado
                doSave = true
            }
            if (item.precioCredito > 0.0 ) {
                producto.precioCredito = item.precioCredito
                doSave = true
            }
            if (doSave) {
                producto.save flush: true
            } 
        }
        lista.aplicada = new Date()
        return  update(lista)
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
            cast(0.0 as big_decimal) as costo,
            p.id as producto,
            pp as proveedor)
            from Producto p 
            left join p.proveedorFavorito pp
            where p.activo = true 
              and p.deLinea = true
            """,
            [year, mes])
        rows.each { item ->
            def found = ProveedorProducto.{producto.id == item.producto}.find([sort='lastUpdated',order: 'desc'])
            if(found) {
                item.costo = found.precio
            }
        }
        return rows
    }

    // 0.00 as precioCredito,
    // 0.00 as precioContado,
    
}
