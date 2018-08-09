package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Subscriber
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent



@Slf4j
@GrailsCompileStatic
class AplicacionDePagoListener {

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof AplicacionDePago ) {
            return ((AplicacionDePago) event.entityObject).id
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)


        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
        }
    }
}
