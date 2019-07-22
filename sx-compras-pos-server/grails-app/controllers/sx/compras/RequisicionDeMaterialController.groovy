package sx.compras

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo


@Slf4j
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class RequisicionDeMaterialController extends RestfulController<RequisicionDeMaterial> {

    static responseFormats = ['json']

    ReportService reportService

    RequisicionDeMaterialService requisicionDeMaterialService

    RequisicionDeMaterialController() {
        super(RequisicionDeMaterial)
    }

    @Override
    protected RequisicionDeMaterial saveResource(RequisicionDeMaterial resource) {
        return requisicionDeMaterialService.save(resource)
    }

    @Override
    @CompileDynamic
    protected List<RequisicionDeMaterial> listAllResources(Map params) {
        
        params.sort = 'lastUpdated'
        params.order = 'desc'
        log.info('List {}', params)
        
        Periodo periodo = params.periodo
        def query = RequisicionDeMaterial.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return  query.list(params)
    }

    def print( ) {
        Map repParams = [ID: params.id]
        def pdf =  reportService.run('RequisicionDeMaterial.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'RequisicionDeMaterial.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
