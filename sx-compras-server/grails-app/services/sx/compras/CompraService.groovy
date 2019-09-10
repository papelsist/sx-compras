package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import grails.plugin.springsecurity.SpringSecurityService
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier

import sx.core.Folio
import sx.core.ProveedorProducto

import sx.security.User
import sx.utils.MonedaUtils


@Slf4j
@GrailsCompileStatic
@Service(Compra)
abstract class CompraService {

    @Autowired
    @Qualifier('springSecurityService')
    SpringSecurityService springSecurityService

    abstract Compra save(Compra compra)

    abstract void delete(Serializable id)

    Compra saveCompra(Compra compra) {
        if(!compra.id) {
            compra.folio = nextFolio(compra)
            compra.nombre = compra.proveedor.nombre
            compra.clave = compra.proveedor.rfc
            compra.rfc = compra.proveedor.rfc
        }
        actualizar(compra)
        logEntity(compra)
        compra.save failOnError: true, flush: true
        return compra

    }

    @CompileDynamic
    void actualizar(Compra compra) {
        compra.partidas.each {
            it.sucursal?: compra.sucursal
            actualizarPartida(it)
        }
        if(compra.proveedor.plazo && compra.entrega == null)
            compra.entrega = compra.fecha + compra.proveedor.plazo
        compra.importeNeto = compra.partidas.sum 0.0, { it.importeNeto }
        compra.importeBruto = compra.partidas.sum 0.0, { it.importeBruto }
        compra.impuestos = MonedaUtils.calcularImpuesto(compra.importeNeto)
        if(compra.partidas) {
            def pendiente = compra.partidas.find{it.getPorRecibir()> 0.0 }
            compra.pendiente = pendiente != null
        } else {
            compra.pendiente = true
        }

        compra.total = compra.importeNeto + compra.impuestos
    }

    Compra cerrarCompra(Compra compra){
        compra.cerrada =  new Date()
        compra.sw2 = 'INSERT'
        logEntity(compra)
        return save(compra)
    }

    Compra depurarCompra(Compra compra) {
        Date depuracion = new Date()
        compra.partidas.each {
            it.depurado = it.getPorRecibir()
            it.depuracion = depuracion
        }
        compra.ultimaDepuracion = depuracion
        compra.pendiente = false
        logEntity(compra)
        if(compra.cerrada && compra.sw2 == 'INSERT') { // FIX para la replica
            compra.sw2 = 'UPDATE'
        }
        return save(compra)
    }


    void actualizarPartida(CompraDet partida) {
        BigDecimal factor = partida.producto.unidad == 'MIL' ? 1000 : 1
        BigDecimal cantidad = partida.solicitado / factor
        BigDecimal importeBruto = MonedaUtils.round(cantidad * partida.precio) as BigDecimal
        BigDecimal importeNeto = MonedaUtils.aplicarDescuentosEnCascada(
                importeBruto,
                partida.descuento1,
                partida.descuento2,
                partida.descuento3,
                partida.descuento4
        )
        BigDecimal costo = MonedaUtils.aplicarDescuentosEnCascada(
                partida.precio,
                partida.descuento1,
                partida.descuento2,
                partida.descuento3,
                partida.descuento4
        )

        partida.costo = costo
        partida.importeBruto = importeBruto
        partida.importeNeto = importeNeto
    }

    Long  nextFolio(Compra compra){
        String serie = compra.sucursal.clave == '1' ? 'OFICINAS' : 'SUC_'+ compra.sucursal.nombre.replaceAll(' ', '_')
        compra.serie = serie
        Folio folio = Folio.findOrCreateWhere(entidad: 'COMPRAS', serie: serie)
        Long res = folio.folio + 1
        folio.folio = res
        folio.save flush: true
        return res
    }

    Compra actualizarPreciosVigentes(Compra compra) {
        def  provs = ProveedorProducto.where{proveedor == compra.proveedor && moneda == compra.moneda}.list()
        Map<String, ProveedorProducto> map = provs.collectEntries {
            [it.producto.clave, it]
        }
        compra.partidas.each { item ->
            ProveedorProducto det = map.get(item.producto.clave)
            if(det) {
                item.precio = det.precioBruto
                item.descuento1 = det.desc1
                item.descuento2 = det.desc2
                item.descuento3 = det.desc3
                item.descuento4 = det.desc4
                item.costo = det.precio
                actualizarPartida(item)
            }

        }
        actualizarTotales(compra)
        // logEntity(compra)
        // return save(compra)

    }

    Compra actualizarPrecios(Compra compra, ListaDePreciosProveedor lista) {
        log.debug("Actualizando compra ${compra.folio} con lista ${lista.id}")
        Map<String, ListaDePreciosProveedorDet> map = lista.partidas.collectEntries {
            [it.clave, it]
        }
        compra.partidas.each {
            ListaDePreciosProveedorDet det = map.get(it.producto.clave)
            if(det) {
                it.precio = det.precioBruto
                it.descuento1 = det.desc1
                it.descuento2 = det.desc2
                it.descuento3 = det.desc3
                it.descuento4 = det.desc4
                it.costo = det.precioNeto
                actualizarPartida(it)
            }

        }
        actualizarTotales(compra)
        logEntity(compra)
        return save(compra)
    }

    @CompileDynamic
    Compra actualizarTotales(Compra compra) {
        compra.importeNeto = compra.partidas.sum 0.0, { it.importeNeto }
        compra.importeBruto = compra.partidas.sum 0.0, { it.importeBruto }
        compra.impuestos = MonedaUtils.calcularImpuesto(compra.importeNeto)
        compra.total = compra.importeNeto + compra.impuestos
        return compra
    }

    @CompileDynamic
    CompraDet depuracionBatch(CompraDet partidas) {
        return partidas
    }

    void logEntity(Compra compra) {

        User user = (User)springSecurityService.getCurrentUser()
        if(user) {
            String username = user.username
            if(compra.id == null || compra.createdBy == null)
                compra.createdBy = username
            compra.lastUpdatedBy = username
        }

    }

}
