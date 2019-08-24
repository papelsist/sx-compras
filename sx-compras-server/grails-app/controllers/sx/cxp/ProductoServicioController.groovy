package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.util.Environment

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j


@GrailsCompileStatic
@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ProductoServicioController extends RestfulController<ProductoServicio> {
    
    static responseFormats = ['json']


    ProductoServicioController() {
        super(ProductoServicio)
    }

    @Override
    @CompileDynamic
    protected List<ProductoServicio> listAllResources(Map params) {
        
        params.sort = params.sort ?:'descripcion'
        params.order = params.order ?:'asc'
        params.max = 5000

        log.info('List: {}', params)
        
        def query = ProductoServicio.where {}

        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { descripcion =~ search || clasificacion =~ search}
        }
        return query.list(params)
    }
}
