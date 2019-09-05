package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.utils.Periodo


@Transactional
// @GrailsCompileStatic
@Slf4j
class ActivoFijoService implements LogUser {
    

    ActivoFijo save(ActivoFijo activo) {
    	log.debug("Salvando activo de material {}", activo)
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

    def generarDepreciacionContable(ActivoFijo activo) {
        def moi = activo.montoOriginal
    }

    def generarDepreciacion(ActivoFijo activo, Date corte = new Date()) {
        Date inicio = activo.adquisicion
        def meses = monthsBetween(inicio, corte)
        log.info('Meses depreciados: {}', meses)
    }


    int monthsBetween(Date from, Date to){
        def cfrom = new GregorianCalendar(time:from)
        def cto   = new GregorianCalendar(time:to)
 
        return ((cto.get(Calendar.YEAR) - cfrom.get(Calendar.YEAR)) 
            * cto.getMaximum(Calendar.MONTH)) 
            + (cto.get(Calendar.MONTH) - cfrom.get(Calendar.MONTH))
    }

   
}
