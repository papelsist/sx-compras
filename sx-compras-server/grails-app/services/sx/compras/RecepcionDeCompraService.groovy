package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import sx.cxp.AnalisisDeFactura
import sx.cxp.AnalisisDeFacturaDet

@Slf4j
// @Transactional
// @CompileStatic
class RecepcionDeCompraService {

    /**
     * Actualiza el costo del Inventario COM como resultado de una actualizacion del analisis
     *
     * @param analisis
     */
    // @CompileDynamic
    @Subscriber
    void onAnalisisActualizado(AnalisisDeFactura analisis){
        log.debug('Update COMS relacionados con  analisis {} ', analisis.folio)
        RecepcionDeCompra.withNewSession {
            List<AnalisisDeFacturaDet> partidas = AnalisisDeFacturaDet.where {analisis.id == analisis.id}.list()
            partidas.each {
                RecepcionDeCompraDet com = it.com
                com.analizado += it.cantidad
                com.save flush: true
            }
        }

    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        /*
        log.debug('Delete: ' + event.getEntity().getName())
        if(event.entityObject  instanceof AnalisisDeFacturaDet) {
            // String id = ((AnalisisDeFacturaDet)event.entityObject).id
            AnalisisDeFacturaDet det = (AnalisisDeFacturaDet)event.entityObject
            log.info('DECREMENT analizado por COM: {}', det.com.id)
            RecepcionDeCompraDet.withNewSession {
                RecepcionDeCompraDet com = RecepcionDeCompraDet.get(det.com.id)
                com.analizado -= com.cantidad
                com.save flush: true
            }

        }
        */
    }
}
