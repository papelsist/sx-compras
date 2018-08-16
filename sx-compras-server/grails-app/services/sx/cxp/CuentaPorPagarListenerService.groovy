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
class CuentaPorPagarListenerService {

    @Autowired ProveedorSaldoService proveedorSaldoService


    CuentaPorPagar getEntity(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof CuentaPorPagar ) {
            return (CuentaPorPagar)event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        CuentaPorPagar cxp = getEntity(event)
        if(cxp) {
            // log.debug('{} {} ', event.eventType.name(), event.entity.name)
            CuentaPorPagar.withNewSession {
                proveedorSaldoService.actualizarSaldo(cxp.proveedor.id)
            }

        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        CuentaPorPagar cxp = getEntity(event)
        if(cxp) {
            // log.debug('{} {} ', event.eventType.name(), event.entity.name)
            CuentaPorPagar.withNewSession {
                proveedorSaldoService.actualizarSaldo(cxp.proveedor.id)
            }

        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        CuentaPorPagar cxp = getEntity(event)
        if(cxp) {
            CuentaPorPagar.withNewSession {
                proveedorSaldoService.actualizarSaldo(cxp.proveedor.id)
            }
        }
    }
}
