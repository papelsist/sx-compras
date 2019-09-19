package sx.activo



import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

import groovy.util.logging.Slf4j

@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class InpcController extends RestfulController<Inpc> {
    static responseFormats = ['json']
    
    InpcController() {
        super(Inpc)
    }

    @Override
    protected List<Inpc> listAllResources(Map params) {
        params.max = 5000
        return  Inpc.list(params)
    }


}
