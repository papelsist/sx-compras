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
        def query = Contrarecibo.where{ atendido == null}
        return query.list(params)
    }

    @Override
    protected Contrarecibo saveResource(Contrarecibo resource) {
        return contrareciboService.saveRecibo(resource)
    }

    @Override
    protected Contrarecibo updateResource(Contrarecibo resource) {
        return contrareciboService.update(resource)
    }

    def pendientes() {
        params.max = 300
        params.sort = 'lastUpdated'
        params.order = 'desc'
        String proveedorId = params['proveedorId']
        def res = CuentaPorPagar.where{proveedor.id == proveedorId && contrarecibo == null }.list(params)
        respond res
    }
}
