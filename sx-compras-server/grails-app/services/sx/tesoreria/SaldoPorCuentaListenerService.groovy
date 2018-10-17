package sx.tesoreria


import grails.compiler.GrailsCompileStatic
import grails.events.annotation.Subscriber
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent

import org.springframework.beans.factory.annotation.Autowired

/**
 * Detecta altas y bajas de movimiento de cuenta para actualizar el saldo de la misma
 *
 */
@Slf4j
@GrailsCompileStatic
class SaldoPorCuentaListenerService {

    @Autowired SaldoPorCuentaDeBancoService saldoPorCuentaDeBancoService


    MovimientoDeCuenta getEntity(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof MovimientoDeCuenta ) {
            return (MovimientoDeCuenta)event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        MovimientoDeCuenta mov = getEntity(event)
        if(mov) {
            log.debug('{} {} ', event.eventType.name(), event.entity.name)
            MovimientoDeCuenta.withNewSession {
                saldoPorCuentaDeBancoService.actualizarSaldo(mov.cuenta.id)
            }
        }

    }


    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        MovimientoDeCuenta mov = getEntity(event)
        if(mov) {
            log.debug('{} {} ', event.eventType.name(), event.entity.name)
            MovimientoDeCuenta.withNewSession {
                saldoPorCuentaDeBancoService.actualizarSaldo(mov.cuenta.id)
            }
        }
    }
}
