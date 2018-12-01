package sx.contabilidad

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
@Secured("ROLE_CONTABILIDAD")
class PolizaController extends RestfulController<Poliza> {

    static responseFormats = ['json']

    PolizaService polizaService

    ReportService reportService

    PolizaController() {
        super(Poliza)
    }

    @Override
    protected List<Poliza> listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        // params.max = 500

        Periodo periodo = (Periodo)params.periodo
        params.ejercicio = params.ejercicio?: Periodo.currentYear()
        params.mes = params.ejericio?: Periodo.currentMes()
        log.debug('List : {}', params)
        def criteria = new DetachedCriteria(Poliza).build {
            eq('ejercicio', params.ejericio)
            eq('mes', params.mes)
            eq('tipo', params.tipo)
            eq('subtipo', params.subtipo)
        }
        return criteria.list(params)
    }

    @Override
    protected Poliza saveResource(Poliza resource) {
        return polizaService.salvarPolza(resource)
    }

    @Override
    protected Poliza updateResource(Poliza resource) {
        return super.updateResource(resource)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
