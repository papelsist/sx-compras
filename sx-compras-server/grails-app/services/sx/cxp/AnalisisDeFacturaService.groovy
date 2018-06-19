package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.Folio

@Slf4j
@Transactional
@GrailsCompileStatic
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

    AnalisisDeFactura update(AnalisisDeFactura analisis) {
        log.debug("UPDATE: {}", analisis)
        analisis.partidas.each {
            it.clave = it.com.producto.clave
            it.descripcion = it.com.producto.descripcion
        }
        analisis.save flush: true
        return analisis
    }


}
