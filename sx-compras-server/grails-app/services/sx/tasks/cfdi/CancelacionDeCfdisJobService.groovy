package sx.tasks.cfdi

import grails.transaction.NotTransactional
import grails.util.Environment
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.scheduling.annotation.Scheduled
import sx.cfdi.CancelacionService
import sx.cfdi.Cfdi

@Slf4j
class CancelacionDeCfdisJobService {


    boolean lazyInit = false

    CancelacionService cancelacionService

    @Scheduled(fixedDelay = 60000L)
    void cancelarCfdisPendientes() {

        Environment.executeForCurrentEnvironment {
            development {
               // this.cancelacionService.cancelarPendientes()
            }
        }

    }

}
