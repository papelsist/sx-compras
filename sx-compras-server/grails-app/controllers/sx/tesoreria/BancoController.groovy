package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j

@GrailsCompileStatic
@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class BancoController extends RestfulController<Banco> {

    static responseFormats = ['json']

    BancoController() {
        super(Banco)
    }

    @Override
    protected List listAllResources(Map params) {
        log.info('List: {}', params)
        def query = Banco.where {}
        params.sort = params.sort ?:'nombre'
        params.order = params.order ?:'asc'
        if(params.term){
            def search = '%' + params.term + '%'
            query = query.where { nombre =~ search}
        }
        return query.list(params)
    }
}
