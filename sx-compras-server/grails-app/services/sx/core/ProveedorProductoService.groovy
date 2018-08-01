package sx.core

import grails.compiler.GrailsCompileStatic

import grails.gorm.services.Service
import grails.gorm.services.Where

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import sx.compras.ListaDePreciosProveedorDet


@GrailsCompileStatic
@Service(ProveedorProducto)
abstract class ProveedorProductoService implements LogUser {

    /**
     * BUG: I can not inject a ProductoService to this service
     *
     */
    // @Autowired
    // @Qualifier('productoService')
    // ProductoService productoService

    ProveedorProducto save(ProveedorProducto producto) {
        logEntity(producto)
        producto.save failOnError:true, flush:true
        return producto
    }

    @Where({ proveedor.id == proveedorId && moneda == moneda })
    abstract List<ProveedorProducto> findProductos(String proveedorId, String moneda)


    ProveedorProducto deleteProducto(ProveedorProducto provProducto) throws Exception{
        Producto producto = provProducto.producto

        if(producto.proveedorFavorito == provProducto.proveedor) {
            log.debug('Actualizando proveedor favorito...')
            producto.proveedorFavorito = null
            producto.save flush: true
        }
        def found = ListaDePreciosProveedorDet.where {producto == provProducto}.find()
        if(found) {
            log.debug('Proveedor producto ya utlizado en Lista de precios {} SE SUSPENDE', found.lista.id)
            provProducto.suspendido = true
            provProducto = provProducto.save flush: true
        } else {
            provProducto.suspendido = false
            provProducto.delete flush: true
        }
        return provProducto

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
