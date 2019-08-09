package sx.audit

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured

import sx.utils.Periodo

@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class AuditController extends RestfulController<Audit> {
    
    static responseFormats = ['json']
    
    AuditController() {
        super(Audit)
    }

    @Override
    protected List<Audit> listAllResources(Map params) {
        log.info('List {}', params)
        Periodo periodo = params.periodo
        def rows = Audit.findAll("""
        	from Audit a 
        	where date(a.dateCreated) between ? and ? 
        	order by lastUpdated desc
        	""",
        	[periodo.fechaInicial, periodo.fechaFinal])
        return  rows
    }
}
