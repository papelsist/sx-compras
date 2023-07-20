package sx.audit

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic

import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent


import sx.core.ExistenciaService
import sx.core.Producto
import sx.cloud.LxProductoService



@Slf4j
@GrailsCompileStatic
@Transactional
class ProductoListenerService {

    ExistenciaService existenciaService
    LxProductoService lxProductoService

    List<String> sucursales = [
        'SOLIS',
         'TACUBA',
         'ANDRADE',
         'CALLE 4',
         'CF5FEBRERO',
         'VERTIZ 176',
         'BOLIVAR',
         'ZARAGOZA']

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
            // Thread.sleep(1000)
            // existenciaService.generarExistencias(producto)
            /*
            Producto.withNewSession {
                existenciaService.generarExistencias(producto)
            }
            */
        }

    }

    @Subscriber
    void afterUpdate(PostUpdateEvent event) {
        Producto producto = getProducto(event)
        if ( producto ) {
            log.debug('{} {} Producto: {}', event.eventType.name(), event.entity.name, producto.clave)
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
        this.sucursales.each {
            buildLog(producto, it, type)
        }
        // lxProductoService.publish(producto)

    }

    def buildLog(Producto producto, String destino, String type) {
        Audit logDet = new Audit(
                name: 'Producto',
                persistedObjectId: producto.id,
                source: 'CENTRAL',
                target: destino,
                tableName: 'producto',
                eventName: type)
        logDet.save flush: true

    }
}
