package sx.core

import groovy.util.logging.Slf4j
import sx.cloud.LxProductoService
import sx.cloud.PapwsProductoService
import sx.core.ExistenciaService
import groovy.sql.Sql
import org.springframework.jdbc.datasource.DriverManagerDataSource

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
        println "producto: "+ producto
        producto = producto.save failOnError: true, flush: true
        logEntity(producto)
        //lxProductoService.publish(producto)
        //papwsProductoService.publish(producto)
        return producto
    }

    Producto updateProductoEcommerce(Producto producto){
        def driverManagerDs=new DriverManagerDataSource()
        driverManagerDs.driverClassName="com.mysql.jdbc.Driver"
        driverManagerDs.url='jdbc:mysql://10.10.1.85:3306/siipapx_tacuba'
        driverManagerDs.username='root'
        driverManagerDs.password='sys'
        def sql = new Sql(driverManagerDs)

        def prod = sql.firstRow("Select * from producto_ecommerce where producto = ?",[producto.id])
        println producto.properties
        sql.execute("update producto_ecommerce set precio_contado= ? , precio_credito = ?, activo  = ?, stock = ?  where producto = ?  ",
        [producto.precioContado, producto.precioCredito, producto.activoEcommerce, producto.stock,producto.id])

       

        return producto
    }
    

}
