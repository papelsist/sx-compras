package sx.core

import groovy.util.logging.Slf4j
import sx.cloud.LxProductoService
import sx.cloud.PapwsProductoService
import sx.core.ExistenciaService

@Slf4j
class ProductoService implements LogUser {
    

    LxProductoService lxProductoService

    ExistenciaService existenciaService

    PapwsProductoService papwsProductoService

    Producto saveProducto(Producto producto) {
        if(producto.id) {
            throw new RuntimeException("Producto ${producto.clave} ya generado con el id: ${producto.id}")
        }
        logEntity(producto)
        producto = producto.save failOnError: true, flush: true
        existenciaService.generarExistencias(producto)
        lxProductoService.publish(producto)
        papwsProductoService.publish(producto)
        return producto
    }

    Producto updateProducto(Producto producto) {
        producto = producto.save failOnError: true, flush: true
        logEntity(producto)
        lxProductoService.publish(producto)
        papwsProductoService.publish(producto)
        return producto
    }


}
