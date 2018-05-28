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
        def query = Proveedor.where {}
        params.max = 50

        Boolean tipo = this.params.tipo
        if(tipo) query = query.where {tipo == tipo}

        Boolean activos = this.params.getBoolean('activos')
        if(activos) query = query.where {activo == activos}


        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { nombre =~ search}
            return query.list(params)
        }

        return query.list(params)
    }
}
