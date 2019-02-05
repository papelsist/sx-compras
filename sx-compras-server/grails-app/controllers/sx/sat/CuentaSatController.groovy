package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.converters.*
import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CuentaSatController extends RestfulController {

    static responseFormats = ['json']

    CuentaSatController() {
        super(CuentaSat)
    }

    @Override
    @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
    def index(Integer max) {
        params.max = max?: 20
        params.sort = params.codigo
        params.order = params.order ?:'asc'
        log.debug('Index : {}', params)
        def q = CuentaSat.where {}

        if(params.term) {
            def term = "${params.term}%"
            log.info('Term: {}', term)
            q = q.where {codigo =~ term || nombre =~ term.toUpperCase()}
        }
        respond q.list(params)
    }
}
