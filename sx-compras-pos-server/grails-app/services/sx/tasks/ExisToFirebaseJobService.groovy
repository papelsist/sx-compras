package sx.tasks

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import grails.util.Environment
import grails.gorm.transactions.Transactional

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.beans.factory.annotation.Value

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.cloud.LxExistenciaService

@Slf4j
@Transactional
class ExisToFirebaseJobService {

    boolean lazyInit = false

    LxExistenciaService lxExistenciaService
    
    /**
    * Se puede arrancar con -Dfirebase.sync=true|false
    */
    @Value('${firebase.sync}')
    boolean activo = true
    

    @Scheduled(fixedDelay = 60000L, initialDelay = 30000L)
    void syncFromAuditLog() {
        Environment.executeForCurrentEnvironment {
            if(activo) {
                Date start = new Date()
                production {
                    log.debug('Sincronizando existencias con FireBase [PROD] Start:{}', start)
                    lxExistenciaService.publishFromAudit()
                }
                development {
                    log.debug('Sincronizando existencias con FireBase [DEV] Start: {}', start)
                    lxExistenciaService.publishFromAudit()
                }
            }

        }

    }
    
}
