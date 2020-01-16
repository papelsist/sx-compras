package sx.tasks

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import grails.util.Environment
import grails.gorm.transactions.Transactional

import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.scheduling.annotation.Scheduled

import sx.cloud.LxExistenciaService

@Slf4j
@Transactional
class ExisToFirebaseJobService {

    boolean lazyInit = false

    LxExistenciaService lxExistenciaService
    

    @Scheduled(fixedDelay = 60000L, initialDelay = 30000L)
    void syncFromAuditLog() {
        Environment.executeForCurrentEnvironment {
            Date start = new Date()
            production {
                log.info('Sincronizando existencias con FireBase [PROD] Start:{}', start)
                lxExistenciaService.publishFromAudit()
            }
            development {
                log.info('Sincronizando existencias con FireBase [DEV] Start: {}', start)
                lxExistenciaService.publishFromAudit()
            }
        }

    }
    
}
