package sx.audit

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PreDeleteEvent


import org.springframework.beans.factory.annotation.Autowired

import sx.compras.Compra

@Slf4j
// @CompileStatic
@Transactional
class CompraListenerService {

    @Autowired AuditLogDataService auditLogDataService

     List<String> sucursales = [
        'SOLIS',
         'TACUBA',
         'ANDRADE',
         'CALLE 4',
         'CF5FEBRERO',
         'VERTIZ 176',
         'BOLIVAR']

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Compra ) {
            return ((Compra) event.entityObject).id
        }
        null
    }

    Compra getCompra(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Compra ) {
            return (Compra) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        Compra compra = getCompra(event)
        if ( compra ) {
            logEntity(compra, 'INSERT')
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
         String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            Compra compra = getCompra(event)
            Thread.sleep(1000)
            logEntity(compra, 'UPDATE')
        }
    }

    @Subscriber
    void beforeDelete(PreDeleteEvent event) {
        Compra compra = getCompra(event)
        if ( compra ) {
            Compra.withNewSession {
                String type = 'DELETE'
                String target = compra.sw2
                log.info('Evento: {} Compra: {} Sucursal: {}', type, compra.id, compra.sw2)
                Boolean central = target == 'OFICINAS' ? true : false
                if(central) {
                    this.sucursales.each {
                        buildLog(compra, target, type)
                    }
                } else {
                    buildLog(compra, target, type)
                }
            }
        }
    }

    def logEntity(Compra compra, String type) {
        Boolean central = compra.sucursal.clave.trim() == '1' ? true : false
        if(central) {

            ['SOLIS',
             'TACUBA',
             'ANDRADE',
             'CALLE 4',
             'CF5FEBRERO',
             'VERTIZ 176',
             'BOLIVAR'].each {
                // Thread.sleep(1000)
                buildLog(compra, it, type)
            }
        } else {
            buildLog(compra, compra.sucursal.nombre, type)
        }
    }

    def buildLog(Compra compra, String destino, String type) {
        log.info('Generando AUDITLOG {} para {}', type, destino)

        Audit alog = new Audit(
                name: 'Compra',
                persistedObjectId: compra.id,
                source: 'CENTRAL',
                target: destino,
                tableName: 'compra',
                eventName: type
        )
        alog.save flush: true
        // auditLogDataService.save(alog)
        if(type == 'INSERT') {
            /*
            Thread.sleep(1000)
            compra.partidas.each {
                Audit logDet = new Audit(
                    name: 'CompraDet',
                    persistedObjectId: it.id,
                    source: 'CENTRAL',
                    target: destino,
                    tableName: 'compra_det',
                    eventName: type)
                logDet.save flush: true
            }
            */
        }
        
        
    }
}
