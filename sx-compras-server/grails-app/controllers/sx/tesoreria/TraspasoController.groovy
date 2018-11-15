package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class TraspasoController extends RestfulController<Traspaso> {

    static responseFormats = ['json']

    TraspasoService traspasoService

    ReportService reportService

    TraspasoController() {
        super(Traspaso)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'

        log.debug('List : {}', params)
        Periodo periodo = (Periodo)params.periodo

        def criteria = new DetachedCriteria(Traspaso).build {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
        }
        return criteria.list(params)
    }

    @Override
    protected Traspaso saveResource(Traspaso resource) {
        return traspasoService.registrar(resource)
    }

    @Override
    protected Traspaso updateResource(Traspaso resource) {
        return traspasoService.actualizar(resource)
    }

    def relacionDeTraspasos(){
        def repParams = [:]
        def pdf =  reportService.run('RelacionDeTraspasos.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'RelacionDeTraspasos.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
