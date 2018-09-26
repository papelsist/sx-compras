package sx.audit

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import org.springframework.beans.factory.annotation.Autowired
import sx.core.Existencia


@Slf4j
@CompileStatic
@Transactional
class ExistenciaListenerService {

    @Autowired AuditLogDataService auditLogDataService

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Existencia ) {
            return ((Existencia) event.entityObject).id
        }
        null
    }

    Existencia getExistencia(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Existencia ) {
            return (Existencia) event.entityObject
        }
        null
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        // log.debug('{} {} ', event.eventType.name(), event.entity.name)
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            Existencia exis = getExistencia(event)
            logEntity(exis, 'UPDATE')
        }
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        // log.debug('{} {} ', event.eventType.name(), event.entity.name)
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            Existencia exis = getExistencia(event)
            logEntity(exis, 'INSERT')
        }
    }



    def logEntity(Existencia exis, String type) {

        AuditLog audit = new AuditLog(
                name: 'Existencia',
                persistedObjectId: exis.id,
                source: exis.sucursal.nombre,
                target: 'CENTRAL',
                tableName: 'Existencia',
                eventName: type
        )
        AuditLog res = auditLogDataService.save(audit)
        // this.log.info('AuditLog generado {}', res)
    }

}
