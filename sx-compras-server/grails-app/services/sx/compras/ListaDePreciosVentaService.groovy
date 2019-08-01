package sx.compras

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.core.Proveedor


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
    
}
