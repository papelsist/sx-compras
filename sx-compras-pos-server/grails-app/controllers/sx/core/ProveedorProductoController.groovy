package sx.core

import grails.compiler.GrailsCompileStatic

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import org.apache.commons.lang3.exception.ExceptionUtils

@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class ProveedorProductoController extends RestfulController<ProveedorProducto> {

    static responseFormats = ['json']

    ProveedorProductoController() {
        super(ProveedorProducto)
    }

    @Override
    protected List<ProveedorProducto> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = 3000
        String proveedorId = params.proveedorId
        return ProveedorProducto.where{ proveedor.id == proveedorId}.list(params)
    }

    def disponibles() {
        def rows = Producto.findAll("from Producto p " +
                " where p.activo = true " +
                " and p.id not in(" +
                "       select pp.producto.id from ProveedorProducto pp " +
                "       where pp.proveedor.id = ? and pp.moneda = ?) " +
                " order by p.linea.linea",
                [params.proveedorId, params.moneda])
        respond rows, [view: '']
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

