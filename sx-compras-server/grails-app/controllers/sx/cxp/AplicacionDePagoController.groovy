package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*


@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class AplicacionDePagoController extends RestfulController<AplicacionDePago> {

    static responseFormats = ['json']

    AplicacionDePagoController() {
        super(AplicacionDePago)
    }
}
