package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import sx.reports.ReportService
import sx.utils.Periodo

@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class CompraController extends RestfulController<Compra> {
    static responseFormats = ['json']
    CompraService compraService
    ReportService reportService

    CompraController() {
        super(Compra)
    }


    @Override
    protected Compra saveResource(Compra resource) {
        return compraService.saveCompra(resource)
    }

    @Override
    @CompileDynamic
    protected List<Compra> listAllResources(Map params) {
        params.max = 500
        params.sort = 'folio'
        params.order = 'desc'
        def query = Compra.where{}

        if(params.periodo) {
            Periodo periodo = params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return  query.list(params)
    }

    def print( ) {
        Map repParams = [ID: params.long('id')]
        def pdf =  reportService.run('ListaDePrecios.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ListaDePrecios.pdf')
    }
}
