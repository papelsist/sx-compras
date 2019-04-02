package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class FacturistaPrestamoController extends RestfulController<FacturistaPrestamo> {

    static responseFormats = ['json']

    FacturistaPrestamoController() {
        super(FacturistaPrestamo)
    }
}
