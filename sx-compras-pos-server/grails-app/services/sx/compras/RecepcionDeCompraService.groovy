package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Publisher
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

import sx.core.Existencia
import sx.core.Folio
import sx.core.Inventario
import sx.core.LogUser


@Slf4j
@GrailsCompileStatic
@Transactional
class RecepcionDeCompraService implements LogUser {


    @Publisher
    RecepcionDeCompra saveRecepcion(RecepcionDeCompra resource) {
        if(resource.id == null) {
            def serie = resource.sucursal.clave
            resource.documento = nextFolio(serie)
        }
        resource.partidas.each {  RecepcionDeCompraDet it ->
            it.comentario = resource.comentario
            BigDecimal factor = it.producto.unidad == 'MIL' ? 1000 : 1
            BigDecimal kilos = it.producto.kilos * (it.cantidad/factor)
            it.kilos = kilos
        }
        logEntity(resource)
        resource = resource.save flush: true
        afectarInventario(resource)
        actualizarExistencias(resource)
        actualizarCompra(resource)
        return resource
    }

    void afectarInventario( RecepcionDeCompra com) {
        def renglon = 1
        com.partidas.each { RecepcionDeCompraDet det ->
            Inventario inventario = new Inventario()
            inventario.sucursal = com.sucursal
            inventario.documento = com.documento
            inventario.cantidad = det.cantidad
            inventario.comentario = det.comentario
            inventario.fecha = com.fecha
            inventario.producto = det.producto
            inventario.tipo = 'COM'
            inventario.renglon = renglon
            det.inventario = inventario
            renglon++
        }
        com.fechaInventario = new Date()
    }

    @Publisher
    actualizarExistencias(RecepcionDeCompra com) {
        Date hoy = com.fecha
        Long ejercicio = hoy[Calendar.YEAR]
        Long mes = hoy[Calendar.MONTH] + 1
        com.partidas.each {
            RecepcionDeCompraDet det = (RecepcionDeCompraDet)it
            Existencia existencia = Existencia.where { anio == ejercicio && mes == mes && producto == det.producto && sucursal == com.sucursal }.find()
            if(existencia) {
                existencia.cantidad = existencia.cantidad + det.cantidad.abs()
                existencia.save flush: true
                // log.debug('Existencia actualizada: {}', existencia.id)
            }
        }
    }


    void actualizarCompra(RecepcionDeCompra com) {
        Compra compra = com.compra
        if(compra.partidas.find{it.getPorRecibir()> 0.0 } == null){
            compra.pendiente=false
        }
        else{
            compra.pendiente=true
        }
        compra.save flush: true
        log.debug('Status de compra {} actualizado', compra.folio)
    }

    Long  nextFolio(String serie){
        Folio folio = Folio.findOrCreateWhere(entidad: 'COMS', serie: serie)
        Long res = folio.folio + 1
        folio.folio = res
        folio.save flush: true
        return res
    }


}
