package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser


@Transactional
@GrailsCompileStatic
@Slf4j
class ActivoFijoService implements LogUser {
    

    ActivoFijo save(ActivoFijo activo) {
    	// log.debug("Salvando activo de material {}", activo)
        logEntity(activo)
        activo.save failOnError: true, flush: true
        return activo

    }

    ActivoFijo update(ActivoFijo activo) {
    	// log.debug("Actualizando activo de material {}", activo)
        logEntity(activo)
        activo.save failOnError: true, flush: true
        return activo

    }

   
}
