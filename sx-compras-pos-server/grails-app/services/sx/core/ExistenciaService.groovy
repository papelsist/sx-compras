package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import grails.gorm.transactions.Transactional

// @GrailsCompileStatic
@Transactional
class ExistenciaService {

    Existencia save(Existencia existencia) {
        existencia = existencia.save flush: true
        return existencia
    }
}
