package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ProveedorController extends RestfulController<Proveedor> {
    static responseFormats = ['json']
    ProveedorController() {
        super(Proveedor)
    }

    @Override
    protected List<Proveedor> listAllResources(Map params) {
        params.max = 1000

        String tipo = params.tipo?: 'COMPRAS'
        def query = Proveedor.where{tipo == 'COMPRAS'}

        if(tipo != 'COMPRAS')
            params.max = 50

        String estado = this.params.estado
        if (estado) {
            if(estado == 'ACTIVOS') {
                query = query.where {activo == true}
            } else if( estado == 'INACTIVOS') {
                query = query.where {activo == false}
            }
        }

        if(params.term){
            // def search = '%' + params.term + '%'
            def search = "%${params.term}%"
            query = query.where { nombre =~ search}
        }
        return query.list(params)
    }
}
