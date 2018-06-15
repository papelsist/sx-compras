package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.rest.*
import grails.converters.*

@GrailsCompileStatic
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
        return analisisDeFactura
    }

    @Override
    protected AnalisisDeFactura saveResource(AnalisisDeFactura resource) {
        return this.analisisDeFacturaService.save(resource)
    }
}