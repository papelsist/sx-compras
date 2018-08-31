package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ProveedorController extends RestfulController<Proveedor> {
    ProveedorService proveedorService
    static responseFormats = ['json']
    ProveedorController() {
        super(Proveedor)
    }

    @Override
    protected List<Proveedor> listAllResources(Map params) {
        def query = Proveedor.where{tipo == 'COMPRAS'}
        return query.list(params)
    }


}
