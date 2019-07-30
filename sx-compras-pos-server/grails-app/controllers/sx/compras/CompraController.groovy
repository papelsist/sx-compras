package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.transform.CompileDynamic
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.AppConfig
import sx.core.Proveedor
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
    @CompileDynamic
    protected List<Compra> listAllResources(Map params) {
        Periodo periodo = params.periodo
        log.info('List {}', periodo)
        def query = Compra.where{}
        query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return  query.list([sort: 'lastUpdated', order: 'desc', max: 10000])
    }

    // @CompileDynamic
    def print( ) {
        Map repParams = [ID: params.id]
        repParams.CLAVEPROV = params.getBoolean('clavesProveedor', false)? 'SI' : 'NO'
        repParams.IMPRIMIR_COSTO = 'SI'
        def pdf =  reportService.run('Compra.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ListaDePrecios.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
