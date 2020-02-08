package sx.cloud


import groovy.util.logging.Slf4j

import org.springframework.scheduling.annotation.Scheduled

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import grails.util.Environment

import com.google.cloud.firestore.*
import com.google.firebase.cloud.FirestoreClient
import com.google.api.core.ApiFuture

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.AppConfig
import sx.core.Producto
import sx.audit.Audit

@Slf4j
// @GrailsCompileStatic
@Transactional
class LxProductoService {


    FirebaseService firebaseService

    

    def publish(Producto prod) {
        LxProducto xp = new LxProducto(prod)
        ApiFuture<WriteResult> result = firebaseService.getFirestore()
            .collection('productos')
            .document(xp.id)
            .set(xp.toMap())
            def updateTime = result.get().getUpdateTime()
        log.debug("{} Published succesful at time : {} " , xp.clave, updateTime)
        logAudit(xp.id, "UPDATE", "${xp.clave} UPDATED IN FIREBASE", 1)
        return updateTime
    }

    def publishAll() {
        logAudit('PRODUCTOS_TB', "UPDATE", "PUBLISH ALL PRODUCTOS TO FIREBASE", 1000)
        /*
        try {
          
        }catch (Exception ex) {
            def c = ExceptionUtils.getRootCause(ex)
            def message = ExceptionUtils.getRootCauseMessage(ex)
            log.error('Error: {}', message)
            return
        }
        */
    }

    

    Audit logAudit(String id, String event, String message, int registros) {
        Audit.withNewSession {
            Audit alog = new Audit(
                name: 'LxProducto',
                persistedObjectId: id,
                source: 'OFICINAS',
                target: 'FIREBASE',
                tableName: 'Producto',
                eventName: event,
                message: message
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
    // @Scheduled(fixedDelay = 60000L, initialDelay = 30000L)
    void syncFromAuditLog() {
        Environment.executeForCurrentEnvironment {
            if(activo) {
                Date start = new Date()
                production {
                    log.debug('Sincronizando existencias con FireBase [PROD] Start:{}', start)
                    publishAll()
                }
            }

        }

    }
    

}
