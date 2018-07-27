package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.Folio
import sx.core.LogUser
import sx.utils.MonedaUtils


@GrailsCompileStatic
@Service(ListaDePreciosProveedor)
@Slf4j
abstract class CompraService implements LogUser{

    abstract Compra save(Compra compra)

    abstract void delete(Serializable id)

    Compra saveCompra(Compra compra) {
        if(!compra.id) {
            compra.folio = nextFolio()
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
        compra.importeNeto = compra.partidas.sum 0.0, { it.importeNeto }
        compra.importeBruto = compra.partidas.sum 0.0, { it.importeBruto }
        compra.impuestos = MonedaUtils.calcularImpuesto(compra.importeNeto)
        compra.total = compra.importeNeto + compra.impuestos
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

    Long  nextFolio(){
        Folio folio = Folio.findOrCreateWhere(entidad: 'COMPRAS', serie: 'OFICINAS')
        Long res = folio.folio + 1
        log.info('Asignando folio de compra: {}', res)
        folio.folio = res
        folio.save flush: true
        return res
    }

}
