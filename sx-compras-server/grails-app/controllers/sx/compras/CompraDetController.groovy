package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*


@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class CompraDetController extends RestfulController<CompraDet> {
    static responseFormats = ['json']
    CompraDetController() {
        super(CompraDet)
    }

    @Override
    protected List<CompraDet> listAllResources(Map params) {
        String compraId = params.compraId
        return CompraDet.where{ compra.id == compraId}.list()
    }

    @Override
    protected CompraDet saveResource(CompraDet resource) {
        return super.saveResource(resource)
    }

    @Override
    protected CompraDet updateResource(CompraDet resource) {
        return super.updateResource(resource)
    }

    @Override
    protected void deleteResource(CompraDet resource) {
        super.deleteResource(resource)
    }
}
