package sx.tasks.cxp

import grails.gorm.transactions.Transactional
import grails.util.Environment
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.scheduling.annotation.Scheduled
import sx.cxp.ComprobanteFiscalService

@Slf4j
@CompileStatic
class ImportarComprobantesJobService {

    boolean lazyInit = false
    ComprobanteFiscalService comprobanteFiscalService

    @Scheduled(fixedDelay = 120000L, initialDelay = 120000L)
    void importarComprobantesDeCompras() {
        if(Environment.current == Environment.DEVELOPMENT)
            return
        log.info('Importando CFDIS de COMPRAS  desde {} , {}', comprobanteFiscalService.cfdiDir, new Date().format("dd/MM/yyyy hh:mm:ss"))
        try{
            int rows = comprobanteFiscalService.importacionLocal('COMPRAS')
            log.info('Comprobantes importados: {}', rows)
        } catch (Exception ex) {
            String message = ExceptionUtils.getRootCauseMessage(ex)
            log.error(message)
        }
    }
}
