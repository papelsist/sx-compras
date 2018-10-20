package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

import sx.reports.ReportService
import sx.utils.Periodo

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
        params.max = params.registros?: 50
        params.sort = 'lastUpdated'
        params.order = 'desc'
        def query = Contrarecibo.where{ }
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        if(params.proveedor) {
            String provId = params.proveedor
            query = query.where { proveedor.id == provId}
        }

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

    @Override
    protected void deleteResource(Contrarecibo resource) {
        super.deleteResource(resource)
    }

    def pendientes() {
        params.max = 300
        params.sort = 'lastUpdated'
        params.order = 'desc'
        String proveedorId = params['proveedorId']
        def res = CuentaPorPagar.where{proveedor.id == proveedorId && contrarecibo == null }.list(params)
        respond res
    }

    def print( ) {
        Map repParams = [ID: params.long('id')]
        def pdf =  reportService.run('Contrarecibo.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Contrarecibo.pdf')
    }
}
