package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController


@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class MarcaController extends RestfulController<Marca> {
    static responseFormats = ['json']
    MarcaController() {
        super(Marca)
    }

    @Override
    protected List<Marca> listAllResources(Map params) {
        params.max = 500
        return super.listAllResources(params)
    }
}
