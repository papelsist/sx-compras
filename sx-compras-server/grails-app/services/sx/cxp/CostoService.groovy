package sx.cxp

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import sx.core.Inventario

@Slf4j
@CompileStatic
// @Transactional
class CostoService {

    /**
     * Actualiza el costo del Inventario COM como resultado de una actualizacion del analisis
     *
     * @param analisis
     */
    @CompileDynamic
    @Subscriber
    void onActualizarAnalisis(AnalisisDeFactura analisis){
        log.debug('Actualizando costo del inventario por analisis: {} Partidas: {}', analisis.folio, analisis.partidas.size())
        Inventario.withNewSession {
            List<AnalisisDeFacturaDet> partidas = AnalisisDeFacturaDet.where {analisis.id == analisis.id}.list()
            partidas.each {
                Inventario inventario = it.com.inventario
                inventario.costo = it.costoUnitario
                // log.debug("Act costo de : {} {} {}", it.clave, it.costoUnitario, inventario.id)
                inventario.save flush: true
            }
        }
    }


}
