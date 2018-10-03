package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Subscriber
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent

import org.springframework.beans.factory.annotation.Autowired

/**
 * Detecta cambios en Pago para actualizar el saldo del proveedor
 *
 */
@Slf4j
@GrailsCompileStatic
class ProveedorSaldoListenerService {

    @Autowired ProveedorSaldoService proveedorSaldoService


    Pago getEntity(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Pago ) {
            return (Pago)event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        Pago pago = getEntity(event)
        if(pago) {
            // log.debug('{} {} ', event.eventType.name(), event.entity.name)
            Pago.withNewSession {
                proveedorSaldoService.actualizarSaldo(pago.proveedor.id)
            }
        }

    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        Pago pago = getEntity(event)
        if(pago) {
            log.debug('{} {} ', event.eventType.name(), event.entity.name)
            Pago.withNewSession {
                proveedorSaldoService.actualizarSaldo(pago.proveedor.id)
            }

        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        Pago pago = getEntity(event)
        if(pago) {
            log.debug('{} {} ', event.eventType.name(), event.entity.name)
            Pago.withNewSession {
                proveedorSaldoService.actualizarSaldo(pago.proveedor.id)
            }
        }
    }
}
