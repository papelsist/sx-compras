package sx.tasks.cxp

import grails.gorm.transactions.Transactional
import grails.util.Environment

import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.scheduling.annotation.Scheduled

import sx.cxp.ReciboElectronicoService

@Slf4j
class RecibosElectronicosWatcherJobService {

    boolean lazyInit = false
    ReciboElectronicoService reciboElectronicoService

    @Scheduled(fixedDelay = 120000L, initialDelay = 120000L)
    void generarRecibos() {

        Environment.executeForCurrentEnvironment {
            compras {
                log.info('Generando recibos electronicos de pago at: {} ', new Date().format("dd/MM/yyyy hh:mm:ss"))
                try{
                    reciboElectronicoService.procesarCfdisPendientes()
                } catch (Exception ex) {
                    String message = ExceptionUtils.getRootCauseMessage(ex)
                    log.error(message)
                }
            }
        }

    }


    @Scheduled(fixedDelay = 120000L, initialDelay = 120000L)
    void vincularRequisiciones() {

        Environment.executeForCurrentEnvironment {
            compras {
                log.info('Vinculando requisiciones pendientes de recibo at: {} ', new Date().format("dd/MM/yyyy hh:mm:ss"))
                try{
                    reciboElectronicoService.vincularRequisicionesPendientes()
                } catch (Exception ex) {
                    String message = ExceptionUtils.getRootCauseMessage(ex)
                    log.error(message)
                }
            }
        }

    }
}
