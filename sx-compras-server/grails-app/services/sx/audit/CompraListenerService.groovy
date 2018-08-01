package sx.audit

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import org.springframework.beans.factory.annotation.Autowired

import sx.audit.AuditLog
import sx.audit.AuditLogDataService
import sx.compras.Compra


@Transactional
class CompraListenerService {

    @Autowired AuditLogDataService auditLogDataService

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

    // @Subscriber
    void afterInsert(PostInsertEvent event) {
        String id = getId(event)
        if ( id ) {


        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            Compra compra = getCompra(event)
            log(compra, 'UDATE')
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        String compra = getCompra(event)
        if ( compra ) {
            log(compra, 'DELETE')
        }
    }

    AuditLog log(Compra compra, String type) {
        // log.debug('Compra cerrada: {}', compra.cerrada ? 'SI' : 'NO')
        if(compra.cerrada != null) {
            String destino = compra.sucursal.clave.trim() == '1' ? 'CENTRAL' : compra.sucursal.nombre
            AuditLog log = new AuditLog(
                    name: 'Compra',
                    persistedObjectId: compra.id,
                    source: 'CENTRAL',
                    target: destino,
                    tableName: 'compra',
                    eventName: type
            )
            auditLogDataService.save(log)
        }

    }
}
