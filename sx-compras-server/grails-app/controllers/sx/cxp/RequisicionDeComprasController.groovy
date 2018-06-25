package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@GrailsCompileStatic
class RequisicionDeComprasController extends RestfulController<RequisicionDeCompras> {

    static responseFormats = ['json']

    RequisicionDeComprasController() {
        super(RequisicionDeCompras)
    }
}
