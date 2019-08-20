package sx.compras

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import sx.core.LogUser
import sx.core.FolioLog

@Transactional
@GrailsCompileStatic
@Slf4j
class RequisicionDeMaterialService implements LogUser, FolioLog {

    RequisicionDeMaterial save(RequisicionDeMaterial requisicion) {
    	// log.debug("Salvando requisicion de material {}", requisicion)
        if(!requisicion.id )
            requisicion.folio = nextFolio('REQUISICION_MATERIAL', 'REQUISICION')
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion

    }

    RequisicionDeMaterial update(RequisicionDeMaterial requisicion) {
    	// log.debug("Actualizando requisicion de material {}", requisicion)
        requisicion.partidas.each {
        	it.sucursal = requisicion.sucursal
        	logEntity(it)
        }
        if (requisicion.partidas) {
            requisicion.cerrada = new Date()
        }
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion

    }

    RequisicionDeMaterial saveFromAlcance(RequisicionDeMaterial requisicion) {
        // log.debug("Salvando requisicion de material {}", requisicion)
        if(!requisicion.id )
            requisicion.folio = nextFolio('REQUISICION_MATERIAL', 'REQUISICION')
        logEntity(requisicion)
        requisicion.partidas.each {
            it.sucursal = requisicion.sucursal
            logEntity(it)
        }
        requisicion.cerrada = new Date()
        requisicion.save failOnError: true, flush: true
        return requisicion

    }
}
