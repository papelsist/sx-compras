package sx.audit

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import org.springframework.beans.factory.annotation.Autowired
import sx.core.ExistenciaService
import sx.core.Producto



@Slf4j
@CompileStatic
// @Transactional
class ProductoListenerService {

    @Autowired AuditLogDataService auditLogDataService

    @Autowired ExistenciaService existenciaService


    String getId(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Producto ) {
            return ((Producto) event.entityObject).id
        }
        null
    }

    Producto getProducto(AbstractPersistenceEvent event) {
        if ( event.entityObject instanceof Producto ) {
            return (Producto) event.entityObject
        }
        null
    }

    @Subscriber
    void afterInsert(PostInsertEvent event) {
        Producto producto = getProducto(event)
        if(producto) {
            log.debug('Alta de producto nuevo generando existencias')
            logEntity(producto, 'INSERT')
            Producto.withNewSession {
                existenciaService.generarExistencias(producto)
            }
        }

    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        // log.debug('{} {} ', event.eventType.name(), event.entity.name)
        String id = getId(event)
        if ( id ) {
            log.debug('{} {} Id: {}', event.eventType.name(), event.entity.name, id)
            Producto producto = getProducto(event)
            logEntity(producto, 'UPDATE')
        }
    }



    @Subscriber
    void afterDelete(PostDeleteEvent event) {
        Producto producto = getProducto(event)
        if ( producto ) {
            logEntity(producto, 'DELETE')
        }
    }

    def logEntity(Producto producto, String type) {

        ['SOLIS',
         'TACUBA',
         'ANDRADE',
         'CALLE 4',
         'CF5FEBRERO',
         'VERTIZ 176',
         'BOLIVAR'].each {
            buildLog(producto, it, type)
        }

    }

    def buildLog(Producto producto, String destino, String type) {
        AuditLog log = new AuditLog(
                name: 'Producto',
                persistedObjectId: producto.id,
                source: 'CENTRAL',
                target: destino,
                tableName: 'producto',
                eventName: type
        )
        auditLogDataService.save(log)

    }
}
