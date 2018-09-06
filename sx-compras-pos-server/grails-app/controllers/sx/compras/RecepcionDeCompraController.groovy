package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Proveedor

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class RecepcionDeCompraController extends RestfulController<RecepcionDeCompra> {
    static responseFormats = ['json']

    RecepcionDeCompraService recepcionDeCompraService;

    RecepcionDeCompraController() {
        super(RecepcionDeCompra)
    }

    @Override
    protected List<RecepcionDeCompra> listAllResources(Map params) {
        log.debug('List {}', params)
        params.sort = 'lastUpdated'
        params.order = 'desc'
        return super.listAllResources(params)
    }

    /**
     * Regresa todos las entradas por compra inventariadas pendientes de
     * analizar
     *
     * @param proveedor
     */
    @CompileDynamic
    def pendientesDeAnalisis(Proveedor proveedor) {
        List list = RecepcionDeCompraDet.findAll(
                "select distinct(d.recepcion) from RecepcionDeCompraDet d " +
                        " where d.recepcion.proveedor =? " +
                        " and d.cantidad - d.analizado > 0 " +
                        " and d.recepcion.cancelado is null" +
                        " order by d.recepcion.fecha asc",
                [proveedor])
        list*.actualizarPendiente()
        respond list
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
