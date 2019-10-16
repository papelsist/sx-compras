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

    AuditoriaFiscalCfdiService auditoriaFiscalCfdiService

    AuditoriaFiscalCfdiController() {
        super(AuditoriaFiscalCfdi)
    }

     @Override
    protected List<AuditoriaFiscalCfdi> listAllResources(Map params) {
        log.info('List: {}', params)
        def ej = params.ejercicio
        def ms = params.mes
        def query =  AuditoriaFiscalCfdi.where{ejercicio == ej}
        def res = query.list()
        respond res
    }


    def generar(Integer ejercicio, Integer mes) {
        auditoriaFiscalCfdiService.auditar(ejercicio, mes)
        def query =  AuditoriaFiscalCfdi.where{ejercicio == ejercicio}
        def res = query.list()
        respond res
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        // log.error(message, ExceptionUtils.getRootCause(e))
        log.error(message, e)
        respond([message: message], status: 500)
    }
}
