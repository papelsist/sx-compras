package sx.core

import grails.compiler.GrailsCompileStatic
import grails.rest.*


@GrailsCompileStatic
class LineaController extends RestfulController<Linea> {
    static responseFormats = ['json']
    LineaController() {
        super(Linea)
    }

    @Override
    protected List<Linea> listAllResources(Map params) {
        params.max = 500
        return super.listAllResources(params)
    }
}
