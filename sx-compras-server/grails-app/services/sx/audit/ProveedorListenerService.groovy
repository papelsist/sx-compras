package sx.audit

import grails.events.annotation.Subscriber
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import sx.core.Proveedor


@Slf4j
@CompileStatic
class ProveedorLogListenerService {

    ProveedorLogDataService proveedorLogDataService

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Proveedor ) {
            return ((Proveedor) event.entityObject).id
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        log.debug('AfterInsert: event {}', event.entityObject.class.name);
        String id = getId(event)
        if ( id ) {
            log.info 'After Proveedor save...'
            proveedorLogDataService.save('SAVE', id)
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        String id = getId(event)
        log.debug('AfterUpdate: event {}', event.entityObject.class.name);
        if ( id ) {
            log.info "After Proveedor update..."
            proveedorLogDataService.save('UPDATE', id)
        }
    }


}
