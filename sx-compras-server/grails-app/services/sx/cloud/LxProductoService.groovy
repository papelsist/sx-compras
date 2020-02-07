package sx.cloud


import groovy.util.logging.Slf4j

import org.springframework.scheduling.annotation.Scheduled

import grails.compiler.GrailsCompileStatic

import com.google.cloud.firestore.*
import com.google.firebase.cloud.FirestoreClient
import com.google.api.core.ApiFuture

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.AppConfig
import sx.core.Producto


@Slf4j
@GrailsCompileStatic
class LxProductoService {


    FirebaseService firebaseService

    void publish(String id, String clave, Map<String, Object> data) {

        try {
            ApiFuture<WriteResult> result = firebaseService.getFirestore()
            .collection('productos')
            .document(id)
            .set(data)
            def updateTime = result.get().getUpdateTime()
            log.debug("Publish time : {} " , updateTime)
            // return updateTime
        }catch (Exception ex) {
            def c = ExceptionUtils.getRootCause(ex)
            def message = ExceptionUtils.getRootCauseMessage(ex)
            log.error('Error: {}', message)
        }
    }


    
    /*
    @Scheduled(fixedDelay = 60000L, initialDelay = 30000L)
    void syncWithFirebase() {
        Environment.executeForCurrentEnvironment {
            Date start = new Date()
            production {
                log.debug('Sincronizando existencias con FireBase [PROD] Start:{}', start)
                // lxExistenciaService.publishFromAudit()
            }
            development {
                log.debug('Sincronizando existencias con FireBase [DEV] Start: {}', start)
                publishFromAudit()
            }
        }
    }

    */

}
