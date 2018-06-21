package sx.cxp

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

// @Transactional
@Slf4j
// @CompileStatic
class CuentaPorPagarService {

    /**
     * Actualiza el importe de lo analizado como resultado de una actualizacion de un analisis de compra
     *
     * @param analisis
     */
    /*
    @Subscriber
    void onActualizarAnalisis(AnalisisDeFactura analisis){

        if(analisis.cerrada) {
            log.debug('Actualizando analizado de la cuenta por pagar {}', analisis.factura.id)
            CuentaPorPagar.withNewSession {
                CuentaPorPagar cxp = CuentaPorPagar.get(analisis.factura.id)
                // cxp.analizado = analisis.importe
                // cxp.save()
            }
        }

        log.debug('Actualizando analizado de la cuenta por pagar {}', analisis.factura.id)
    }
    */
}
