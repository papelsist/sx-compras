package sx.audit

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import org.springframework.beans.factory.annotation.Autowired

import sx.core.ProveedorProducto
import sx.core.Sucursal


@Slf4j
@GrailsCompileStatic
@Transactional
class ProveedorProductoListenerService {

    @Autowired AuditLogDataService auditLogDataService

    List targets = ['SOLIS',
                    'TACUBA',
                    'ANDRADE',
                    'CALLE 4',
                    'CF5FEBRERO',
                    'VERTIZ 176',
                    'BOLIVAR']

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof ProveedorProducto ) {
            return ((ProveedorProducto) event.entityObject).id
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        String id = getId(event)
        if ( id ) {
            log.info 'After ProveedorProducto  {} save...', id
            log(event, 'INSERT', id)
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        String id = getId(event)
        if ( id ) {
            log.debug('UDATE {} {}', event.entity.name, event.eventType.name())
            log(event, 'UPDATE', id)
        }
    }

    def log(AbstractPersistenceEvent event, String type, String id) {
        ['SOLIS',
         'TACUBA',
         'ANDRADE',
         'CALLE 4',
         'CF5FEBRERO',
         'VERTIZ 176',
         'BOLIVAR'].each { target ->
            AuditLog log = new AuditLog(
                    name: event.entityObject.getClass().getSimpleName(),
                    persistedObjectId: id,
                    source: 'CENTRAL',
                    target: target,
                    tableName: 'proveedor_producto',
                    eventName: type
            )
            auditLogDataService.save(log)
        }

    }


}
