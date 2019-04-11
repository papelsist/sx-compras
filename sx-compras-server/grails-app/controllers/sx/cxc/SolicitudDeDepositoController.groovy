package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.core.Sucursal
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_TESORERIA', 'ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
class SolicitudDeDepositoController extends RestfulController<SolicitudDeDeposito> {

    static responseFormats = ['json']

    ReportService reportService

    SolicitudDeDepositoService solicitudDeDepositoService

    SolicitudDeDepositoController() {
        super(SolicitudDeDeposito)
    }

    @Override
    protected SolicitudDeDeposito saveResource(SolicitudDeDeposito resource) {
        return solicitudDeDepositoService.save(resource)
    }

    @Override
    protected SolicitudDeDeposito createResource() {
        SolicitudDeDeposito solicitud = new SolicitudDeDeposito()
        solicitud.folio = -1
        bindData(solicitud, getObjectToBind())
        solicitud.sucursal = Sucursal.where{ nombre == 'OFICINAS'}.find()
        return solicitud
    }

    @Override
    protected List<SolicitudDeDeposito> listAllResources(Map params) {
        log.info('List: {}', params)
        def query = SolicitudDeDeposito.where{}
        if(params.cartera) {
            String cartera = params.cartera
            query = query.where{tipo == cartera}
        }
        return query.list(params)
    }

    def cobranza(SolsFechaSucursalCommand command) {
        Map repParams = [:]
        repParams.FECHA = command.fecha.format('yyyy/MM/dd')
        repParams['SUCURSAL'] = command.sucursal.id
        repParams['SALDOAFAVOR'] = 0.0
        def pdf = this.reportService.run('CobranzaCamioneta', repParams)
        def fileName = "CobranzaCOD.pdf"
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: fileName)

    }

    def disponibles(SolsFechaSucursalCommand command) {
        Map repParams = [:]
        repParams.FECHA = command.fecha.format('yyyy/MM/dd')
        repParams['SUCURSAL'] = command.sucursal.id
        def pdf = this.reportService.run('DisponiblesSucursal', repParams)
        def fileName = "DisponiblesSucursal.pdf"
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: fileName)

    }
}


class SolsFechaSucursalCommand {
    Date fecha
    Sucursal sucursal
    String cartera

    String toString() {
        return " ${sucursal.nombre} ${fecha.format('dd/MM/yyyy')}"
    }

    static mapping = {
        cartera nullable: true
    }
}