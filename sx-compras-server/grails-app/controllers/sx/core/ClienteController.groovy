package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

// @GrailsCompileStatic
// @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@Secured("permitAll")
class ClienteController extends RestfulController<Cliente> {

    static responseFormats = ['json']

    ClienteController() {
        super(Cliente)
    }

    @Override
    protected List listAllResources(Map params) {
        log.info('List: {}', params)
        params.max = 30
        def query = Cliente.where {}
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        if (params.cartera) {
            if(params.cartera.startsWith('CRE') ){
                query = query.where {credito != null && credito.lineaDeCredito != null}
            } else if (params.cartera.startsWith('CON') || params.cartera.startsWith('COD')) {
                // log.debug('BUSCANDO : {}', params)
                // query = query.where {credito == null }
            }
        }
        if(params.term){
            def search = '%' + params.term + '%'
            // log.debug('Search: {}', search)
            query = query.where { nombre =~ search}
        }
        return query.list(params)
    }



}
