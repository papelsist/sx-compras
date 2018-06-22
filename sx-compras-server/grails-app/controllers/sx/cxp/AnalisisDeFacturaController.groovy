package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.rest.RestfulController
import sx.reports.ReportService


class AnalisisDeFacturaController extends RestfulController<AnalisisDeFactura> {
    static responseFormats = ['json']

    AnalisisDeFacturaService analisisDeFacturaService

    ReportService reportService

    AnalisisDeFacturaController() {
        super(AnalisisDeFactura)
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
}
