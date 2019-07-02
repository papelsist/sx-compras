package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

@GrailsCompileStatic
@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ProductoController extends RestfulController<Producto> {

    static responseFormats = ['json']

    ProductoService productoService

    ProductoController() {
        super(Producto)
    }


    @Override
    @CompileDynamic
    protected List<Producto> listAllResources(Map params) {
        def query = Producto.where {}
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 1000

        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { clave =~ search || descripcion =~ search}
        }

        if(params.activos) {
            Boolean activos = this.params.getBoolean('activos')
            query = query.where {activo == activos}
        }


        if(params.deLinea) {
            Boolean deLinea = this.params.getBoolean('deLinea')
            query = query.where {deLinea == deLinea}
        }
        List<Producto> res =  query.list(params)

        respond res
    }

    /*
    @Override
    protected Producto updateResource(Producto resource) {
        return super.updateResource(resource)
    }

    @Override
    protected Producto saveResource(Producto resource) {
        return super.saveResource(resource)
    }
    */
}
