package sx.core

import grails.compiler.GrailsCompileStatic
import grails.rest.*
import grails.converters.*

@GrailsCompileStatic
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
