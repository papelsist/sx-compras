package sx.cxp

import grails.gorm.transactions.Transactional

@Transactional
class AnalisisDeFacturaService {

    AnalisisDeFactura save(AnalisisDeFactura analisisDeFactura) {
        analisisDeFactura.save failOnError: true
        return analisisDeFactura
    }
}
