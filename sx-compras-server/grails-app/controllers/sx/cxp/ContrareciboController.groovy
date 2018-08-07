package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.reports.ReportService

@Slf4j()
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class ContrareciboController extends RestfulController<Contrarecibo> {
    static responseFormats = ['json']

    ReportService reportService
    ContrareciboService contrareciboService

    ContrareciboController() {
        super(Contrarecibo)
    }

    @Override
    protected List<Contrarecibo> listAllResources(Map params) {
        return super.listAllResources(params)
    }

    @Override
    protected Contrarecibo saveResource(Contrarecibo resource) {
        return contrareciboService.saveRecibo(resource)
    }

    @Override
    protected Contrarecibo updateResource(Contrarecibo resource) {
        return contrareciboService.saveRecibo(resource)
    }

    def buscarFactura(String serie, String folio) {
        params.max = 100
        params.sort = 'fecha'
        params.order = 'desc'
        respond CuentaPorPagar.where{serie == serie && folio == folio}.list(params)
    }
}
