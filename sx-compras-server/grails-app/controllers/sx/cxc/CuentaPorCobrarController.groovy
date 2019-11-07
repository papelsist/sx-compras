package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Cliente
import sx.core.Sucursal
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_TESORERIA', 'ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
class CuentaPorCobrarController extends RestfulController<CuentaPorCobrar> {

    static responseFormats = ['json']

    ReportService reportService

    CuentaPorCobrarService cuentaPorCobrarService

    CuentaPorCobrarController() {
        super(CuentaPorCobrar)
    }

    def pendientes(Cliente cliente) {
        if (cliente == null) {
            notFound()
            return
        }
        params.max = Math.min(params.getInt('max') ?: 10, 100)
        def cartera = params.cartera ?: 'CRE'
        List<CuentaPorCobrar> rows = []
        if(cartera == 'JUR') {
            rows = CuentaPorCobrar.findAll(
                    "from CuentaPorCobrar c  where c.cliente = ?  and c.total - c.pagos > 0 ",
                    [cliente])
        } else {
            log.info('Pendientes de {} {}', cliente, params)
            rows = CuentaPorCobrar.findAll(
                    "from CuentaPorCobrar c  where c.cliente = ? and c.tipo = ? and c.saldoReal > 0 ",
                    [cliente, cartera])
        }
        log.debug('Cuentas por cobrar para: {} : {}', cliente.nombre, rows.size())
        respond rows.sort {it.atraso }.reverse()
    }

    def carteraCod(CobranzaCodCommand command) {
        def repParams = [:]
        repParams.FECHA = command.fecha.format('yyyy-MM-dd')
        repParams.SUCURSAL = command.sucursal.id
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def pdf = reportService.run('cxc/CarteraCOD_Emb.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'CarteraCOD.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

class CobranzaCodCommand {
    Sucursal sucursal
    Date fecha

    static constraints = {
        sucursal nullable: true
    }
}
