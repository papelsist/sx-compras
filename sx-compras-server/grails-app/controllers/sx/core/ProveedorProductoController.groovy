package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class ProveedorProductoController extends RestfulController<ProveedorProducto> {
    static responseFormats = ['json']
    ProveedorProductoService proveedorProductoService

    ProveedorProductoController() {
        super(ProveedorProducto)
    }

    @Override
    protected ProveedorProducto saveResource(ProveedorProducto resource) {
        return this.proveedorProductoService.save(resource)
    }

    @Override
    protected ProveedorProducto updateResource(ProveedorProducto resource) {
        return this.proveedorProductoService.save(resource)
    }

    @Override
    protected List<ProveedorProducto> listAllResources(Map params) {
        String recepcionId = params.proveedorId
        return ProveedorProducto.where{ proveedor.id == proveedorId}.list()
    }
}
