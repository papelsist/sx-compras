package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import grails.plugin.springsecurity.SpringSecurityService
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Service(Producto)
abstract  class ProductoService implements LogUser {

    /*
    @Autowired
    @Qualifier('springSecurityService')
    SpringSecurityService springSecurityService
    */

    abstract Producto save(Producto prod)

    Producto saveProducto(Producto producto) {
        logEntity(producto)
        if(producto.id == null) {
            generarExistencias(producto)
        }
        return save(producto)
    }

    def generarExistencias(Producto producto) {
        Integer ejercicio = Periodo.currentYear()
        Integer mes = Periodo.currentMes()
        List<Sucursal> sucurales = Sucursal.where{ almacen == true}.list()
        sucurales.each {
            Existencia existencia = Existencia.where { anio == ejercicio && mes == mes && producto == producto && sucursal == it }.find()
            if(!existencia) {
                existencia = new Existencia(anio: ejercicio, mes: mes, producto: producto, sucursal: it)
                existencia.nacional = producto.nacional
                existencia.kilos = producto.kilos
                existencia.cantidad = 0.0
                existencia.existenciaInicial = 0.0
                existencia.save flush: true
            }

        }
    }


}
