package sx.contabilidad.fiscal

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.reports.ReportService


@Slf4j
@Secured(['ROLE_CONTABILIDAD'])
// @GrailsCompileStatic
class AuditoriaFiscalCfdiController extends RestfulController<AuditoriaFiscalCfdi> {

    static responseFormats = ['json']

    ReportService reportService

    AuditoriaFiscalCfdiController() {
        super(AuditoriaFiscalCfdi)
    }


    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
