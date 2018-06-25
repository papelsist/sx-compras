package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController


@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CuentaPorPagarController extends RestfulController<CuentaPorPagar> {
    static responseFormats = ['json']
    CuentaPorPagarController() {
        super(CuentaPorPagar)
    }

    def pendientesDeAnalisis() {
        String id = params.proveedorId
        List<CuentaPorPagar> res = CuentaPorPagar.where{proveedor.id == id &&analizada == false}.list()
        respond res
    }
}
