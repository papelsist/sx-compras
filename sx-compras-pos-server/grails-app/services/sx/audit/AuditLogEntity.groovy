package sx.audit

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent


trait AuditLogEntity<T> {

    T getEntity(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof T ) {
            return (T) event.entityObject
        }
        null
    }

}