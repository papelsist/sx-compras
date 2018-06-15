package sx.compras


import grails.rest.RestfulController

import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j


@CompileStatic
@Slf4j
class RecepcionDeCompraDetController extends RestfulController<RecepcionDeCompraDet> {
    static responseFormats = ['json']
    RecepcionDeCompraDetController() {
        super(RecepcionDeCompraDet)
    }

    @Override
    @CompileDynamic
    protected List<RecepcionDeCompraDet> listAllResources(Map params) {
        String recepcionId = params.recepcionId
        return RecepcionDeCompraDet.where{ recepcion.id == recepcionId}.list()
    }
}
