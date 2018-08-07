package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.rest.*


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
}
