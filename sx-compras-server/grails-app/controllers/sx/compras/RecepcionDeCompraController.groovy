package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.rest.*
import grails.converters.*
import sx.core.Proveedor

@GrailsCompileStatic
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
    def pendientesDeAnalisis(Proveedor proveedor) {
        params.max = 100
        params.sort = 'lastUpdated'
        params.order = 'desc'
        //def query = RecepcionDeCompra.where {proveedor == proveedor && fechaInventario != null && pendienteDeAnalisis > 0}
        //respond query.list(params)
        def list = RecepcionDeCompraDet.findAll(
                "select distinct(d.recepcion) from RecepcionDeCompraDet d where d.recepcion.proveedor =? and d.cantidad - d.analizado > 0 ",
                [proveedor])
        respond list
    }
}
