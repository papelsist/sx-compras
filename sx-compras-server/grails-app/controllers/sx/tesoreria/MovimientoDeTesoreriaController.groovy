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
class MovimientoDeTesoreriaController extends RestfulController<MovimientoDeTesoreria> {

    static responseFormats = ['json']

    MovimientoDeTesoreriaService movimientoDeTesoreriaService

    ReportService reportService

    MovimientoDeTesoreriaController() {
        super(MovimientoDeTesoreria)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        log.debug('List : {}', params)
        Periodo periodo = (Periodo)params.periodo

        def criteria = new DetachedCriteria(MovimientoDeTesoreria).build {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
        }
        return criteria.list(params)
    }

    @Override
    protected MovimientoDeTesoreria saveResource(MovimientoDeTesoreria resource) {
        return movimientoDeTesoreriaService.registrar(resource)
    }

    @Override
    protected MovimientoDeTesoreria createResource() {
        MovimientoDeTesoreria instance = new MovimientoDeTesoreria()
        bindData instance, getObjectToBind()
        instance.movimiento = movimientoDeTesoreriaService.generarMovimiento(instance)
        instance
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        // e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
