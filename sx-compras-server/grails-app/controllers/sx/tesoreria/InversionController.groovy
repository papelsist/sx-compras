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
class InversionController extends RestfulController<Inversion> {

    static responseFormats = ['json']

    InversionService inversionService

    ReportService reportService

    InversionController() {
        super(Inversion)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        log.debug('List : {}', params)
        Periodo periodo = (Periodo)params.periodo

        def criteria = new DetachedCriteria(Inversion).build {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
        }
        return criteria.list(params)
    }

    @Override
    protected Inversion saveResource(Inversion resource) {
        return inversionService.registrar(resource)
    }

    @Override
    protected Inversion updateResource(Inversion resource) {
        return inversionService.actualizar(resource)
    }

    def relacionDeInversiones(){
        def repParams = [:]
        def pdf =  reportService.run('RelacionDeInversiones.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'RelacionDeInversiones.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        // e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
