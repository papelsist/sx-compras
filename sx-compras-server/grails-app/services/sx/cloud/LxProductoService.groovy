package sx.cloud


import groovy.util.logging.Slf4j

import org.springframework.scheduling.annotation.Scheduled

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import grails.util.Environment

import com.google.cloud.firestore.*
import com.google.firebase.cloud.FirestoreClient
import com.google.api.core.ApiFuture
import com.google.api.core.ApiFutures

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.AppConfig
import sx.core.Producto
import sx.audit.Audit

@Slf4j
@GrailsCompileStatic
@Transactional
class LxProductoService {

    final static String COLLECTION = 'productos'

    FirebaseService firebaseService

    def publish(Producto prod) {
        LxProducto xp = new LxProducto(prod)
        ApiFuture<WriteResult> result = getCollection()
            .document(xp.id)
            .set(xp.toMap())
            def updateTime = result.get().getUpdateTime()
        log.debug("{} Published succesful at time : {} " , xp.clave, updateTime)
        logAudit(xp.id, "UPDATE", "${xp.clave} UPDATED IN FIREBASE", 1)
        return updateTime
    }

    /**
    *
    * Sincroniza todo el catalog de productos de Papel en Firebase
    * 
    */
    def publishAll() {
        def productos = getCollection()
        List<ApiFuture<WriteResult>> futures = new ArrayList<>();

        findAllProductos().each { xp ->
            futures.add(productos.document(xp.id).set(xp.toMap()))
        }

        ApiFutures.allAsList(futures).get();
        def rows = futures.size()
        log.debug('Productos: {} actualizados', rows)
        logAudit('PRODUCTOS_TB', "UPDATE", "${rows} PRODUCTOS ACTUALIZADOS EN FIREBASE", rows, new Date())
        
    }

    CollectionReference getCollection() {
        return firebaseService.getFirestore().collection(COLLECTION)
    }

    
    @Transactional(readOnly = true)
    List<LxProducto> findAllProductos() {
        return  Producto.list(fetch: [linea: 'join', marca: 'join', clase: 'join', productoSat: 'join', unidadSat:'join'], 
            sort: 'clave', order: 'asc', max: 5000)
            .collect { Producto prod -> new LxProducto(prod)}
    }
    

    Audit logAudit(String id, String event, String message, int registros, Date updateTime = null) {
        Audit.withNewSession {
            Audit alog = new Audit(
                name: 'LxProducto',
                persistedObjectId: id,
                source: 'OFICINAS',
                target: 'FIREBASE',
                tableName: 'Producto',
                eventName: event,
                message: message,
                dateReplicated: updateTime
            )
            alog.save failOnError: true, flush: true
        }
    }

    /**
     * cronExpression: "s m h D M W Y"
     *                  | | | | | | `- Year [optional]
     *                  | | | | | `- Day of Week, 1-7 or SUN-SAT, ?
     *                  | | | | `- Month, 1-12 or JAN-DEC
     *                  | | | `- Day of Month, 1-31, ?
     *                  | | `- Hour, 0-23
     *                  | `- Minute, 0-59
     *                  `- Second, 0-59
     */
    @Scheduled(cron = "0 0 22 ? * MON-SAT")
    void syncFromAuditLog() {
        if (Environment.current == Environment.PRODUCTION) {
            Date start = new Date()
            log.debug('Sincronizando productos con FireBase [PROD] Start:{}', start)
            publishAll()
        }

    }
    

}
