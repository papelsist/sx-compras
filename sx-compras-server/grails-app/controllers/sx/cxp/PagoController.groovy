package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

@Slf4j()
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class PagoController extends RestfulController<Pago> {
    static responseFormats = ['json']
    PagoService pagoService
    PagoController() {
        super(Pago)
    }
}
