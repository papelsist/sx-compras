package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import grails.gorm.services.Where


@GrailsCompileStatic
@Service(ProveedorProducto)
abstract class ProveedorProductoService implements LogUser {

    ProveedorProducto save(ProveedorProducto producto) {
        logEntity(producto)
        producto.save failOnError:true, flush:true
        return producto
    }

    @Where({ proveedor.id == proveedorId && moneda == moneda })
    abstract List<ProveedorProducto> findProductos(String proveedorId, String moneda)

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
