package sx.audit

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j


import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import org.springframework.beans.factory.annotation.Autowired

import sx.compras.CompraDet

@Slf4j
@GrailsCompileStatic
@Transactional
class CompraDetListenerService {

    List<String> sucursales = [
        'SOLIS',
         'TACUBA',
         'ANDRADE',
         'CALLE 4',
         'CF5FEBRERO',
         'VERTIZ 176',
         'BOLIVAR']

    CompraDet getEntity(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof CompraDet ) {
            return (CompraDet) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        CompraDet compraDet = getEntity(event)
        if ( compraDet ) {
            // logEntity(compraDet, 'INSERT')
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        CompraDet compraDet = getEntity(event)
        if ( compraDet ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, compraDet.id)
            // Thread.sleep(1000)
            logEntity(compraDet, 'UPDATE')
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        CompraDet compraDet = getEntity(event)
        if ( compraDet ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, compraDet.id)
            // Thread.sleep(1000)
            // logEntity(compraDet, 'DELETE')
        }
    }

    @CompileDynamic
    def logEntity(CompraDet compraDet, String type) {
        if(true) {
            Boolean central = compraDet.sucursal.clave.trim() == '1' ? true : false
            if(central) {
                this.sucursales.each{
                    buildLog(compraDet, it, type)
                }
            } else {
                buildLog(compraDet, compraDet.sucursal.nombre, type)
            }

        }

    }

    @CompileDynamic
    def buildLog(CompraDet compraDet, String destino, String type) {
        // log.info('Destino: {}', destino)

        Audit logDet = new Audit(
                name: 'CompraDet',
                persistedObjectId: compraDet.id,
                source: 'CENTRAL',
                target: destino,
                tableName: 'compra_det',
                eventName: type)
        logDet.save flush: true
        
    }
}
