package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class SucursalController extends RestfulController<Sucursal> {
    static responseFormats = ['json']
    SucursalController() {
        super(Sucursal)
    }

    @Override
    protected List<Sucursal> listAllResources(Map params) {
        def query = Sucursal.where {}
        params.sort = params.sort ?:'nombre'
        params.order = params.order ?:'desc'
        if(params.activas){
            query = query.where {activa == true}
        }
        return query.list(params)
    }
}
