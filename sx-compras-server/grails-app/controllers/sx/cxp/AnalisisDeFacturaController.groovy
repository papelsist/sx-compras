package sx.cxp

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import sx.reports.ReportService

import sx.reports.SucursalPeriodoCommand
import sx.utils.Periodo

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class AnalisisDeFacturaController extends RestfulController<AnalisisDeFactura> {
    static responseFormats = ['json']

    // static namespace = 'cxp'

    AnalisisDeFacturaService analisisDeFacturaService

    ReportService reportService

    AnalisisDeFacturaController() {
        super(AnalisisDeFactura)
    }

    @Override
    protected List<AnalisisDeFactura> listAllResources(Map params) {
        log.info('List: {}', params)
        params.max = 1000
        params.sort = 'folio'
        params.order = 'desc'
        def query = AnalisisDeFactura.where {}
        if(params.periodo) {
            Periodo periodo = params.periodo
            query = query.where { fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        /*
        if(params.fechaInicial) {
            Periodo periodo = new Periodo()
            bindData(periodo, params)
            log.info('Periodo: {}',periodo)
            query = query.where { fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        */
        return query.list(params)
    }

    @Override
    protected AnalisisDeFactura createResource() {
        AnalisisDeFactura analisisDeFactura  = new AnalisisDeFactura()
        bindData analisisDeFactura, getObjectToBind()
        analisisDeFactura.createUser = 'PENDIENTE'
        analisisDeFactura.updateUser = 'PENDIENTE'
        analisisDeFactura.folio = 0L
        return analisisDeFactura
    }

    @Override
    protected AnalisisDeFactura saveResource(AnalisisDeFactura resource) {
        return this.analisisDeFacturaService.save(resource)
    }

    @Override
    protected AnalisisDeFactura updateResource(AnalisisDeFactura resource) {
        return analisisDeFacturaService.update(resource)
    }

    @Override
    protected void deleteResource(AnalisisDeFactura resource) {
        analisisDeFacturaService.delete(resource)
    }

    def cerrar(AnalisisDeFactura analisis) {
        if(analisis == null) {
            notFound()
            return
        }
        analisis = analisisDeFacturaService.cerrar(analisis)
        respond analisis
    }

    def print( ) {
        def pdf =  reportService.run('AnalisisDeFactura.jrxml', [ID: params.id])
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'AnalisisDeFactura.pdf')
    }

    def entradasAnalizadas(SucursalPeriodoCommand command) {
        def pdf =  reportService.run('EntradasAnalizadas.jrxml', command.toReportMap())
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EntradasAnalizadas.pdf')
    }
}
