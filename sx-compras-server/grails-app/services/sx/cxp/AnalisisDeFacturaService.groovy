package sx.cxp

import grails.gorm.transactions.Transactional

@Transactional
class AnalisisDeFacturaService {

    AnalisisDeFactura save(AnalisisDeFactura analisisDeFactura) {
        analisisDeFactura.save failOnError: true
        ComprobanteFiscal factura = analisisDeFactura.factura
        factura.analizado = true
        factura.save flush: true
        return analisisDeFactura
    }
}
