package sx.core

import groovy.util.logging.Slf4j
import sx.cloud.LxProductoService
import sx.cloud.PapwsProductoService
import sx.core.ExistenciaService
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

@Slf4j
class ProductoService implements LogUser {
    

    LxProductoService lxProductoService

    ExistenciaService existenciaService

    PapwsProductoService papwsProductoService


    @Qualifier('productoEcommerceintegracion')
    def productoEcommerceIntegracion

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
        println "producto: "+ producto
        producto = producto.save failOnError: true, flush: true
        logEntity(producto)
        //lxProductoService.publish(producto)
        //papwsProductoService.publish(producto)
        return producto
    }

    Producto updateProductoEcommerce(Producto producto){
        println "En el update de producto ecommerce !!!"
        productoEcommerceIntegracion.transformAndUpdateProducto(producto)
        return producto 

    }
    

}
