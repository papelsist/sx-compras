package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import sx.core.Folio
import sx.core.LogUser

@Transactional
@GrailsCompileStatic
@Slf4j
class RequisicionDeComprasService implements LogUser{

    RequisicionDeCompras save(RequisicionDeCompras requisicion) {
        log.debug("Salvando requisicion  {}", requisicion)
        requisicion.folio = Folio.nextFolio('REQUISICION', 'COMPRAS_CXP')
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion
    }
}
