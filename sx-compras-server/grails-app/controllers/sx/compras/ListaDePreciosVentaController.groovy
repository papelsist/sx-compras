package sx.compras

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.Canonical
import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo
import sx.core.Proveedor


@Slf4j
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class ListaDePreciosVentaController extends RestfulController<ListaDePreciosVenta> {

    static responseFormats = ['json']

    ReportService reportService

    ListaDePreciosVentaService listaDePreciosVentaService

    ListaDePreciosVentaController() {
        super(ListaDePreciosVenta)
    }

    @CompileDynamic
    def update() {
        String id = params.id as String
        ListaDePreciosVenta requisicion = ListaDePreciosVenta.get(id)
        bindData requisicion, getObjectToBind()
        requisicion = listaDePreciosVentaService.update(requisicion)
        respond requisicion, view: 'show'
    }
    

    @Override
    protected ListaDePreciosVenta saveResource(ListaDePreciosVenta resource) {
        return listaDePreciosVentaService.save(resource)
    }


    @Override
    @CompileDynamic
    protected List<ListaDePreciosVenta> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        log.info('List {}', params)
        Periodo periodo = params.periodo
        def query = ListaDePreciosVenta.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return  query.list(params)
    }

    @CompileDynamic
    def aplicar() {
        def r = ListaDePreciosVenta.get(params.id)
        if(r == null) {
            notFound()
            return
        }
        r = listaDePreciosVentaService.aplicar(r)
        respond r, view: 'show'
    }

    def print( ) {
        Map repParams = [ID: params.id]
        def pdf =  reportService.run('ListaDePreciosVenta.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ListaDePreciosVenta.pdf')
    }

    @CompileDynamic
    def disponibles() {
        respond listaDePreciosVentaService.disponibles()
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

@Canonical
class ListaProdDto {
    String clave
    String descripcion
    String linea
    String marca
    String clase
    BigDecimal precioAnteriorCredito
    BigDecimal precioAnteriorContado
    BigDecimal precioCredito
    BigDecimal precioContado
    BigDecimal costo
    Proveedor proveedor
}
