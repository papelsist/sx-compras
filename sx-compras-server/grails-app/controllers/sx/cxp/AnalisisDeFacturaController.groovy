package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.rest.RestfulController


class AnalisisDeFacturaController extends RestfulController<AnalisisDeFactura> {
    static responseFormats = ['json']

    AnalisisDeFacturaService analisisDeFacturaService

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
}
