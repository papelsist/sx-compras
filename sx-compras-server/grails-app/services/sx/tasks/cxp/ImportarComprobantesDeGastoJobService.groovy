package sx.tasks.cxp


import grails.util.Environment
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.scheduling.annotation.Scheduled
import sx.cxp.ComprobanteFiscalService

@Slf4j
// @CompileStatic
class ImportarComprobantesDeGastoJobService {

    boolean lazyInit = false
    ComprobanteFiscalService comprobanteFiscalService

    @Scheduled(fixedDelay = 120000L, initialDelay = 60000L)
    void importarComprobantesDeGastos() {
        Environment.executeForCurrentEnvironment {
            tesoreria {
                File dir = new File(comprobanteFiscalService.gastosDir)
                // log.info('Importando CFDIS de GASTOS  desde {} , {}', comprobanteFiscalService.gastosDir, new Date().format("dd/MM/yyyy hh:mm:ss"))
                try{
                    comprobanteFiscalService.importarDirectorio(dir, 'GASTOS', true)
                    log.info('Comprobantes  importados desde Dir: {}', dir.path)
                } catch (Exception ex) {
                    String message = ExceptionUtils.getRootCauseMessage(ex)
                    log.error(message)
                }
            }
        }

    }
    
}
