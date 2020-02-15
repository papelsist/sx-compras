package sx.core

import groovy.util.logging.Slf4j

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import grails.plugin.springsecurity.SpringSecurityService

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

import sx.utils.Periodo
import sx.cloud.LxProductoService
import sx.core.ExistenciaService

@Slf4j
@GrailsCompileStatic
// @Service(Producto)
class ProductoService implements LogUser {
    
    
    // @Autowired
    // @Qualifier('lxProductoService')
    LxProductoService lxProductoService

    // @Autowired
    ExistenciaService existenciaService

/*
    @Autowired
    @Qualifier('existenciaService')
    ExistenciaService existenciaService
    */


    Producto saveProducto(Producto producto) {
        if(producto.id) {
            throw new RuntimeException("Producto ${producto.clave} ya generado con el id: ${producto.id}")
        }
        producto = producto.save failOnError: true, flush: true
        existenciaService.generarExistencias(producto)
        lxProductoService.publish(producto)
        logEntity(producto)
        return producto
    }

    Producto updateProducto(Producto producto) {
        producto = producto.save failOnError: true, flush: true
        lxProductoService.publish(producto)
        logEntity(producto)
        return producto
    }


}
