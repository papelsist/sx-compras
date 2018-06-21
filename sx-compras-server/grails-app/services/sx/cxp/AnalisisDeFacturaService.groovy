package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.events.EventPublisher
import grails.events.annotation.Publisher
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.Folio
import sx.utils.MonedaUtils

@Slf4j
@Transactional
// @GrailsCompileStatic
class AnalisisDeFacturaService {

    AnalisisDeFactura save(AnalisisDeFactura analisis) {
        // Actualizar el status de a cuenta por pagar
        log.debug("Salvando analisis de factura  {}", analisis)
        CuentaPorPagar cxp = analisis.factura
        cxp.analizada = true
        cxp.save flush: true
        analisis.folio = Folio.nextFolio('ANALISIS', 'CXP')
        analisis.save failOnError: true, flush: true
        return analisis
    }

    @Publisher('analisisActualizado')
    // @CompileDynamic
    AnalisisDeFactura update(AnalisisDeFactura analisis) {
        log.info('UPDATE: {}', analisis.id)
        analisis.partidas.each {
            it.clave = it.com.producto.clave
            it.descripcion = it.com.producto.descripcion
            it.costoUnitario = MonedaUtils.aplicarDescuentosEnCascada(it.precioDeLista, it.desc1, it.desc2, it.desc3, it.desc4)
        }
        analisis.save flush: true
        // notify('actualizarCostos', analisis.id)
        return analisis
    }


}
