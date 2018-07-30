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
        log.info('Buscando los productos: {} ', params)
        params.sort = 'lastUpdated'
        params.order = 'desc'
        String proveedorId = params.proveedorId
        String moneda = params.moneda;
        // return proveedorProductoService.findProductos(proveedorId, moneda)
        return ProveedorProducto.where{ proveedor.id == proveedorId && moneda == moneda}.list(params)
    }

    def disponibles() {

        def rows = Producto.findAll("from Producto p " +
                " where p.activo = true " +
                " and p.deLinea = true " +
                " and p.id not in(" +
                "       select pp.producto.id from ProveedorProducto pp " +
                "       where pp.proveedor.id = ? and pp.moneda = ?) " +
                " order by p.linea.linea",
                [params.proveedorId, params.moneda])
        respond rows
    }


    def agregarProductos(AgregarProductosCommand command) {
        String proveedorId = params.proveedorId
        Proveedor proveedor = Proveedor.get(proveedorId)
        List<ProveedorProducto> res = []
        command.productos.each { Producto it ->
            ProveedorProducto pp = new ProveedorProducto(
                    proveedor: proveedor,
                    producto: it,
                    claveProveedor:it.clave,
                    moneda: command.moneda,
                    descripcionProveedor: it.descripcion,
            )
            res << proveedorProductoService.save(pp)
        }

        log.info("Productos generados: ", res.size())
        respond res
    }
}

class AgregarProductosCommand {
    String moneda
    List<Producto> productos

    String toString() {
        return "${moneda} Prods: ${productos.join(',')}"
    }


}
