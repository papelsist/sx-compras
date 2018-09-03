package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.transform.CompileDynamic
import sx.core.Sucursal
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

        params.max = 100
        params.sort = 'folio'
        params.order = 'desc'

        def query = Compra.where{}
        def pendientes = this.params.getBoolean('pendientes') ?: true

        log.info('List: {} Pendientes: {} ', params, pendientes)
        if(pendientes){
            query = query.where{ pendiente == true}
        }

        if(params.periodo && !pendientes) {
            Periodo periodo = params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return  query.list(params)
    }


    def cerrar(Compra compra) {
        if(compra == null) {
            notFound()
            return
        }
        respond compraService.cerrarCompra(compra)
    }

    def depurar(Compra compra) {
        if(compra == null) {
            notFound()
            return
        }
        respond compraService.depurarCompra(compra)
    }

    // @CompileDynamic
    def print( ) {
        Map repParams = [ID: params.id]
        repParams.CLAVEPROV = params.getBoolean('clavesProveedor', false)? 'SI' : 'NO'
        repParams.IMPRIMIR_COSTO = 'SI'
        def pdf =  reportService.run('Compra.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ListaDePrecios.pdf')
    }
}
