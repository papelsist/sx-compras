package sx.activo


import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.core.LogUser
import sx.utils.Periodo

@Slf4j
@Secured(['ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
class ActivoDepreciacionFiscalController extends RestfulController<ActivoDepreciacionFiscal> implements LogUser{
    
    static responseFormats = ['json']

    ActivoDepreciacionFiscalController() {
        super(ActivoDepreciacionFiscal)
    }

     @Override
    def save() {
        ActivoFijo af = ActivoFijo.get(params.activoFijoId)
        log.info('Generando depreciacion para activo: {}', af)
        ActivoDepreciacionFiscal resource = new ActivoDepreciacionFiscal(activoFijo: af)
        bindData resource, getObjectToBind()
        logEntity(resource)
        resource.save failOnError: true, flush: true
        respond resource
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
