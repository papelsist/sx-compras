package sx.cxp

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import sx.compras.RecepcionDeCompraDet
import sx.core.Inventario

@Slf4j
// @CompileStatic
// @Transactional
class CostoService {

    /**
     * Actualiza el costo del Inventario COM como resultado de una actualizacion del analisis
     *
     * @param analisis
     */
    // @CompileDynamic
    @Subscriber()
    void onAnalisisActualizado(AnalisisDeFactura analisis){
        // log.debug('Actualizando costos relacionados con analisis {}', analisis.id)
        log.debug('Actualizando costo del inventario por analisis: {} Partidas: {}', analisis.folio, analisis.partidas.size())


        Inventario.withNewSession {
            List<AnalisisDeFacturaDet> partidas = AnalisisDeFacturaDet.where {analisis.id == analisis.id}.list()
            partidas.each {
                Inventario inventario = it.com.inventario
                inventario.costo = it.costoUnitario
                log.debug("Costo de : {} = {} ", it.clave, it.costoUnitario)
                inventario.save flush: true
            }
        }


    }

    @Subscriber()
    void onAnalisisEliminado(List<String> ...coms){
        log.debug('DELETE costo de coms: {}', coms.size())
        Inventario.withNewSession {
            coms.each {
                RecepcionDeCompraDet com = RecepcionDeCompraDet.get(it)
                if(com.analizado <= 0) {
                    Inventario inventario = com.inventario
                    inventario.costo = 0
                    log.debug("Costo de : {} = {} ", inventario.clave, inventario.costo)
                    inventario.save flush: true
                }
            }
        }
    }



}
