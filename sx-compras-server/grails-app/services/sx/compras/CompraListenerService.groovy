package sx.compras

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent


@Transactional
class CompraListenerService {

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Compra ) {
            return ((Compra) event.entityObject).id
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        // log.debug('AfterInsert: event {}', event.entityObject.class.name);
        String id = getId(event)
        if ( id ) {
            log.info 'After Compra save...'

        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        String id = getId(event)
        // log.debug('AfterUpdate: event {}', event.entityObject.class.name);
        if ( id ) {
            log.info "After Compra update..."

        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        String id = getId(event)
        if ( id ) {
            log.info 'After Compra deleted ...'

        }
    }
}
