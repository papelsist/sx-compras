package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ClaseController extends RestfulController<Clase>{

    static responseFormats = ['json']

    ClaseController() {
        super(Clase)
    }

    @Override
    protected List<Clase> listAllResources(Map params) {
        params.max = 200
        return super.listAllResources(params)
    }
}
