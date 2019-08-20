package sx.audit

import grails.events.annotation.Subscriber


import grails.compiler.GrailsCompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent


import sx.compras.RequisicionDeMaterialDet

@Slf4j
@GrailsCompileStatic
class ReqDeMaterialDetAuditListenerService {
    

    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof RequisicionDeMaterialDet ) {
            return ((RequisicionDeMaterialDet) event.entityObject).id
        }
        null
    }

    RequisicionDeMaterialDet getRequisicionDet(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof RequisicionDeMaterialDet ) {
            return (RequisicionDeMaterialDet) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        RequisicionDeMaterialDet requisicion = getRequisicionDet(event)
        if ( requisicion ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, requisicion.id)
            logEntity(requisicion, 'INSERT')
        }
    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        RequisicionDeMaterialDet requisicion = getRequisicionDet(event)
        if ( requisicion ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, requisicion.id)
            if(requisicion.requisicion.cerrada == null) 
                logEntity(requisicion, 'UPDATE')
        }
    }

    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        RequisicionDeMaterialDet requisicion = getRequisicionDet(event)
        if ( requisicion ) {
            if(requisicion.requisicion.cerrada == null) 
                logEntity(requisicion, 'DELETE')
        }
    }

    void logEntity(RequisicionDeMaterialDet requisicion, String type) {
        log.debug('Log tipo: {} RequisicionDet: {}',type, requisicion.id)
        Audit.withNewSession {
            Audit alog = new Audit(
                name: 'RequisicionDeMaterialDet',
                persistedObjectId: requisicion.id,
                source: requisicion.sucursal,
                target: 'CENTRAL',
                tableName: 'requisicion_de_material_det',
                eventName: type
            )
            alog.save failOnError: true, flush: true
        }
        
        

    }

    
}
