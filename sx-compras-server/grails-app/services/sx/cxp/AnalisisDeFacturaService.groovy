package sx.cxp

import grails.gorm.transactions.Transactional

@Transactional
class AnalisisDeFacturaService {

    AnalisisDeFactura save(AnalisisDeFactura analisisDeFactura) {
        analisisDeFactura.save failOnError: true
        CuentaPorPagar cxp = analisisDeFactura.factura
        cxp.analizada = true
        cxp.save flush: true
        return analisisDeFactura
    }
}
