package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service


@GrailsCompileStatic
@Service(ProveedorProducto)
abstract class ProveedorProductoService implements LogUser {

    ProveedorProducto save(ProveedorProducto producto) {
        logEntity(producto)
        producto.save failOnError:true, flush:true
        return producto
    }

    /*
    List<ProveedorProducto> agregarProductos(String proveedorId, List<Producto> productos, String moneda) {
        Proveedor proveedor = Proveedor.get(proveedorId)
        List<ProveedorProducto> res = []
        productos.each {
            ProveedorProducto pp = new ProveedorProducto(
                    proveedor: proveedor,
                    producto: it,
                    claveProveedor:it.clave,
                    moneda: moneda,
                    descripcionProveedor: it.descripcion,
            )
            logEntity(pp)
            pp.save flush: true
            res << pp
        }
        return res
    }
    */



}
