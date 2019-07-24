package sx.audit

import grails.events.annotation.Subscriber

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import org.springframework.beans.factory.annotation.Autowired

import sx.compras.RequisicionDeMaterial

@Slf4j
// @CompileStatic
// @Transactional
class ReqDeMaterialAuditListenerService {

    @Autowired AuditLogDataService auditLogDataService

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof RequisicionDeMaterial ) {
            return ((RequisicionDeMaterial) event.entityObject).id
        }
        null
    }

    RequisicionDeMaterial getRequisicion(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof RequisicionDeMaterial ) {
            return (RequisicionDeMaterial) event.entityObject
        }
        null
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        RequisicionDeMaterial requisicion = getRequisicion(event)
        if ( requisicion ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, requisicion.id)
            logEntity(requisicion, 'UPDATE')
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        RequisicionDeMaterial requisicion = getRequisicion(event)
        if ( requisicion ) {
            logEntity(requisicion, 'DELETE')
        }
    }

    def logEntity(RequisicionDeMaterial requisicion, String type) {
        log.debug('Log tipo: {} Requisicion: {}',type, requisicion)
        Audit.withNewSession {
            Audit alog = new Audit(
                name: 'RequisicionDeMaterial',
                persistedObjectId: requisicion.id,
                source: 'CENTRAL',
                target: requisicion.sucursal,
                tableName: 'requisicion_de_material',
                eventName: type
            )
            alog.save failOnError: true, flush: true
        }
        
        

    }

    
}
