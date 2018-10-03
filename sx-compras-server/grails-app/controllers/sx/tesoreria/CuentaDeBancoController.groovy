package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CuentaDeBancoController extends RestfulController {
    static responseFormats = ['json']
    CuentaDeBancoController() {
        super(CuentaDeBanco)
    }

    @Override
    protected List listAllResources(Map params) {
        params.max = 20
        println params
        def query = CuentaDeBanco.where{}

        if(params.activas) {
            query = query.where {activo == true}
        }
        if(params.disponibleEnPagos) {
            query = query.where {disponibleEnPagos == true}
        }
        return query.list(params)
    }


}
