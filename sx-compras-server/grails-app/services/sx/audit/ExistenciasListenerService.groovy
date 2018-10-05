package sx.audit

import grails.events.annotation.Subscriber

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import org.springframework.beans.factory.annotation.Autowired
import sx.core.Existencia


@Slf4j
@CompileStatic
// @Transactional
class ExistenciasListenerService {

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
    void afterInsert(PostInsertEvent event) {
        Existencia exis = getExistencia(event)
        if(exis) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, exis)
            logEntity(exis, 'INSERT')
        }

    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            Existencia existencia = getExistencia(event)
            logEntity(existencia, 'UPDATE')
        }
    }

    def logEntity(Existencia existencia, String type) {

        ['SOLIS',
         'TACUBA',
         'ANDRADE',
         'CALLE 4',
         'CF5FEBRERO',
         'VERTIZ 176',
         'BOLIVAR'].each {
            buildLog(existencia, it, type)
        }

        // buildLog(existencia, existencia.sucursal.nombre, type)

    }

    def buildLog(Existencia existencia, String destino, String type) {
        AuditLog log = new AuditLog(
                name: 'Existencia',
                persistedObjectId: existencia.id,
                source: 'CENTRAL',
                target: destino,
                tableName: 'existencia',
                eventName: type
        )
        auditLogDataService.save(log)

    }
}
