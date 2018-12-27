package sx.tasks.cfdi

import grails.gorm.transactions.Transactional
import grails.util.Environment
import groovy.util.logging.Slf4j
import org.springframework.scheduling.annotation.Scheduled
import sx.cfdi.CancelacionService

@Transactional
@Slf4j
class ActualizacionDeCancelacionesJobService {

    boolean lazyInit = false

    CancelacionService cancelacionService

    /**
     * "0 0 6,19 * * *" = 6:00 AM and 7:00 PM every day.
     */
    @Scheduled(cron = "0 0 4,19 * * *")
    void actualizarSolicitudes() {

        Environment.executeForCurrentEnvironment {
            contabilidad {
                int updates = this.cancelacionService.actualizarSolicitudesDeCancelacion()
                log.info("Actualizaciones de solicitudes: {}", updates)
            }
        }

    }
}
