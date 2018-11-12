package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils
import sx.compras.Compra
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class CompraDeMonedaController extends RestfulController<CompraDeMoneda> {

    static responseFormats = ['json']

    CompraDeMonedaService compraDeMonedaService

    ReportService reportService

    CompraDeMonedaController() {
        super(CompraDeMoneda)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        log.debug('List : {}', params)
        Periodo periodo = (Periodo)params.periodo

        def criteria = new DetachedCriteria(CompraDeMoneda).build {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
        }
        return criteria.list(params)
    }

    @Override
    protected CompraDeMoneda saveResource(CompraDeMoneda resource) {
        return compraDeMonedaService.registrar(resource)
    }


    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
