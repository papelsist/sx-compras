package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController


@GrailsCompileStatic
@Secured("permitAll")
class GrupoDeProductoController extends RestfulController<GrupoDeProducto> {
    static responseFormats = ['json']

    GrupoDeProductoController() {
        super(GrupoDeProducto)
    }

    @Override
    protected List<GrupoDeProducto> listAllResources(Map params) {
        params.max = 500
        return super.listAllResources(params)
    }
}
