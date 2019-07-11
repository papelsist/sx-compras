package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils


import static org.springframework.http.HttpStatus.OK

import sx.reports.ReportService
import sx.utils.Periodo
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class PagoIsrController extends RestfulController <PagoIsr> implements LogUser{

    static responseFormats = ['json']

    PagoIsrService pagoIsrService

    ReportService reportService

    PagoIsrController() {
        super(PagoIsr)
    }

    @Override
    protected List<PagoIsr> listAllResources(Map params) {
        Integer ej = params.ejercicio as Integer
        List<PagoIsr> res = PagoIsr.where{ejercicio == ej}.list()
        return res
    }

    def generar() {
        Integer ej = params.ejercicio as Integer
        Integer ms = params.mes as Integer
        log.info('Generar Pago ISR para {}', params)
        def rows = pagoIsrService.generar(ej, ms)
        respond rows
    }
    

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
