package sx.tesoreria


import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Cliente
import sx.cxc.Cobro
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class DevolucionClienteController extends RestfulController<DevolucionCliente> {

    static responseFormats = ['json']

    DevolucionClienteService devolucionClienteService

    ReportService reportService

    DevolucionClienteController() {
        super(DevolucionCliente)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        log.debug('List : {}', params)
        Periodo periodo = (Periodo)params.periodo

        def criteria = new DetachedCriteria(DevolucionCliente).build {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
        }
        return criteria.list(params)
    }


    @Override
    protected DevolucionCliente saveResource(DevolucionCliente resource) {
        resource = devolucionClienteService.registrar(resource)
        resource = devolucionClienteService.generarCheque(resource)
        return resource
    }

    @Override
    @CompileDynamic
    protected void deleteResource(DevolucionCliente resource) {
        devolucionClienteService.cancelar(resource)
        // devolucionClienteService.delete(resource.id)
    }

    def cobros(Cliente cliente) {
        if(cliente == null) {
            notFound()
            return
        }
        def cobros = Cobro.where{cliente == cliente && saldo > 0}.list()
        respond cobros

    }

    def generarCheque(DevolucionCliente devolucionCliente) {
        if(devolucionCliente == null) {
            notFound()
            return
        }
        if(devolucionCliente.egreso.formaDePago == 'CHEQUE' && !devolucionCliente.egreso.cheque) {
            devolucionCliente = devolucionClienteService.generarCheque(devolucionCliente)
        }
        respond devolucionCliente
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

class CobrosFindCommand {
    Cliente cliente
    BigDecimal importe
}
