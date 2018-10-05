package sx.core

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import groovy.util.logging.Slf4j

import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Service(Existencia)
abstract  class ExistenciaService implements LogUser {


    abstract Existencia save(Existencia existencia)


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
                save(existencia)
            }
        }
        log.info("Existencias generadas para el producto {}", producto.clave)
    }


}
