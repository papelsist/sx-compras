package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.util.Environment

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
        params.max = 5000
        // log.info('List: {}', params)

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

        // TEMPO FOR DEVONLY
        if(Environment.current == Environment.DEVELOPMENT) {
            // query = query.where {deLinea == true && activo == true}
            params.max = 5000
        }
        ///END TEMPO

        List<Producto> res =  query.list(params)
        // log.info('All Productos: {}', res.size())
        respond res
    }

    @CompileDynamic
    def lookup() {
        log.info('Lookup: ', params)
        def query = Producto.where {}
        params.max = 5000
        def search = '%' + params.term + '%'
        query = query.where { clave =~ search || descripcion =~ search}
        if(params.activos) {
            Boolean activos = this.params.getBoolean('activos')
            query = query.where {activo == activos}
        }
        List<Producto> res =  query.list(params)
        respond res
    }

    @CompileDynamic
    def rows() {
        log.info('Rows: {}', params)
        List<Producto> res = Producto.findAll("from Producto p order by p.linea.linea")
        respond res, view: 'rows'
    }

    
    @Override
    protected Producto updateResource(Producto resource) {
        return productoService.updateProducto(resource)
    }
    
    @Override
    protected Producto saveResource(Producto resource) {
        return productoService.saveProducto(resource)
    }
    
    
}
