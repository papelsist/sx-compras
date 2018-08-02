package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*


@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class NotaDeCreditoCxPController extends RestfulController<NotaDeCreditoCxP>{

    static responseFormats = ['json']

    NotaDeCreditoCxPController() {
        super(NotaDeCreditoCxP)
    }
}
