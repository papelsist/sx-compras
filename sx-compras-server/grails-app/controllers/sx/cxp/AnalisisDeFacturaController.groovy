package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.rest.*
import grails.converters.*

@GrailsCompileStatic
class AnalisisDeFacturaController extends RestfulController<AnalisisDeFactura> {
    static responseFormats = ['json', 'xml']

    AnalisisDeFacturaService analisisDeFacturaService

    AnalisisDeFacturaController() {
        super(AnalisisDeFactura)
    }

    @Override
    protected AnalisisDeFactura saveResource(AnalisisDeFactura resource) {
        return this.analisisDeFacturaService.save(resource)
    }
}
