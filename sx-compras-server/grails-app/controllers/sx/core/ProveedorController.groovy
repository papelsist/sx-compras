package sx.core

import grails.compiler.GrailsCompileStatic
import grails.rest.*

@GrailsCompileStatic
class ProveedorController extends RestfulController<Proveedor> {
    static responseFormats = ['json']
    ProveedorController() {
        super(Proveedor)
    }

    @Override
    protected List<Proveedor> listAllResources(Map params) {
        // log.info('List {}', params)
        def query = Proveedor.where {}
        params.max = 50

        String tipo = this.params.tipo
        if(tipo)
            query = query.where {tipo == tipo}

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
