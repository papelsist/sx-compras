package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class ChoferController extends RestfulController<Chofer>{

    ChoferController() {
        super(Chofer)
    }

    @Override
    protected List<Chofer> listAllResources(Map params) {
        def query = Chofer.where{}
        return query.list(params)
    }
}
