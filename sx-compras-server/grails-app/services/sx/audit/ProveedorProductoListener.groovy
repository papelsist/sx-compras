package sx.audit

import grails.events.annotation.Subscriber
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import sx.core.ProveedorProducto


@Slf4j
@CompileStatic
class ProveedorProductoListener {

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
            // proveedorLogDataService.save('SAVE', id)
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        String id = getId(event)
        if ( id ) {
            log.info 'After ProveedorProducto  {} UPDATED...', id
            // proveedorLogDataService.save('UPDATE', id)
        }
    }
}
