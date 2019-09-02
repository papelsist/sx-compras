package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser


@Transactional
@GrailsCompileStatic
@Slf4j
class ActivoDepreciacionService implements LogUser {
    

    ActivoDepreciacion save(ActivoDepreciacion depreciacion) {
        logEntity(depreciacion)
        depreciacion.save failOnError: true, flush: true
        return depreciacion

    }

    ActivoDepreciacion update(ActivoDepreciacion depreciacion) {
        logEntity(depreciacion)
        depreciacion.save failOnError: true, flush: true
        return depreciacion

    }

   
}
