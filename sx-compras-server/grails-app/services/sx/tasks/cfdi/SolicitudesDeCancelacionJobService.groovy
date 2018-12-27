package sx.tasks.cfdi

import grails.gorm.transactions.Transactional
import grails.util.Environment
import groovy.util.logging.Slf4j
import org.springframework.scheduling.annotation.Scheduled
import sx.cfdi.CancelacionService

/**
 * Genera las solicitudes de cancelacion pendientes
 *
 */
@Transactional
@Slf4j
class SolicitudesDeCancelacionJobService {

    boolean lazyInit = false

    CancelacionService cancelacionService

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
    @Scheduled(cron = "0 0/30 4,10,11,14,16,18,19,22 ? * MON-SAT")
    void generarSolicitudes() {

        Environment.executeForCurrentEnvironment {
            contabilidad {
                int solicitudes = this.cancelacionService.generarSolicitudesDeCancelacion()
                log.info("Solicitudes de cancelacion generadas: {}", solicitudes)
            }
        }

    }
}
