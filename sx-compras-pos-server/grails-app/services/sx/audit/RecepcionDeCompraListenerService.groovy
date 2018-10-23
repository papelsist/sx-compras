package sx.audit

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent

import org.springframework.beans.factory.annotation.Autowired
import sx.compras.Compra
import sx.compras.RecepcionDeCompra


@Slf4j
@CompileStatic
//@Transactional
class RecepcionDeCompraListenerService {

    @Autowired AuditLogDataService auditLogDataService

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof RecepcionDeCompra ) {
            return ((RecepcionDeCompra) event.entityObject).id
        }
        null
    }

    RecepcionDeCompra getEntity(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof RecepcionDeCompra ) {
            return (RecepcionDeCompra) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        // log.debug('{} {} ', event.eventType.name(), event.entity.name)
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            RecepcionDeCompra com = getEntity(event)
            actualizarStatus(com)
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            RecepcionDeCompra com = getEntity(event)
            actualizarStatus(com)
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            RecepcionDeCompra com = getEntity(event)
            actualizarStatus(com)
        }
    }

    @CompileDynamic
    def actualizarStatus(RecepcionDeCompra com) {
        try{
            Compra.withNewSession {
                Compra compra = Compra.get(com.compra.id)
                def pendiente = compra.partidas.find{it.getPorRecibir()> 0.0 }
                compra.pendiente = pendiente != null
                depuracionDeNegativos(compra)
                compra.save flush: true
                log.debug('Status de compra {} actualizado a : {}', compra.folio, compra.status)
            }

        }catch (Exception ex) {
            String message = ExceptionUtils.getRootCauseMessage(ex)
            log.error("Error actualizando estatus de compra {}  Err: {}", com.compra.folio, message)
        }
    }

    @CompileDynamic
    def depuracionDeNegativos(Compra compra) {
        compra.partidas.each{
            if(it.porRecibir < 0) {
                def ajuste  = it.depurado  - (it.porRecibir * -1)
                it.depurado = ajuste
                it.depuracion = new Date()
                compra.ultimaDepuracion = new Date()
            }
        }
    }



    def logEntity(RecepcionDeCompra exis, String type) {}

}
