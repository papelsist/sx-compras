package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
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
        params.max = 100
        params.sort = 'lastUpdated'
        params.order = 'desc'
        //def query = RecepcionDeCompra.where {proveedor == proveedor && fechaInventario != null && pendienteDeAnalisis > 0}
        //respond query.list(params)
        List list = RecepcionDeCompraDet.findAll(
                "select distinct(d.recepcion) from RecepcionDeCompraDet d where d.recepcion.proveedor =? and d.cantidad - d.analizado > 0 ",
                [proveedor])
        list*.actualizarPendiente()
        respond list
    }
}
