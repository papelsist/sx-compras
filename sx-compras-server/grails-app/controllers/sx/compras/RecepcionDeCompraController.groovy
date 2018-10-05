package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Proveedor
import sx.core.Sucursal
import sx.reports.ReportService
import sx.utils.Periodo

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class RecepcionDeCompraController extends RestfulController<RecepcionDeCompra> {
    static responseFormats = ['json']

    RecepcionDeCompraService recepcionDeCompraService

    ReportService reportService

    RecepcionDeCompraController() {
        super(RecepcionDeCompra)
    }

    @Override
    protected List<RecepcionDeCompra> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros?: 200
        log.debug('List {}', params)
        def query = RecepcionDeCompra.where {}
        if(params.proveedorId) {
            String proveedorId = params.proveedorId
            query = query.where{proveedor.id == proveedorId}
        }
        if(params.periodo) {
            Periodo periodo =(Periodo)params.periodo
            query = query.where{fecha > periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return query.list(params)
    }

    /**
     * Regresa todos las entradas por compra inventariadas pendientes de
     * analizar
     *
     * @param proveedor
     */
    @CompileDynamic
    def pendientesDeAnalisis(Proveedor proveedor) {
        List list = RecepcionDeCompraDet.findAll(
                "select distinct(d.recepcion) from RecepcionDeCompraDet d " +
                        " where d.recepcion.proveedor =? " +
                        " and d.cantidad - d.analizado > 0 " +
                        " and d.recepcion.cancelado is null" +
                        " order by d.recepcion.fecha asc",
                [proveedor])
        list*.actualizarPendiente()
        respond list
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }

    def print( RecepcionDeCompra com) {
        Map repParams = [:]
        repParams.ENTRADA = com.id
        repParams.SUCURSAL = com.sucursal.id
        def pdf =  reportService.run('EntradaPorCompra.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EntradaPorCompra.pdf')
    }

    def recepcionesPorDia(RecepcionesPorFecha command) {
        params.FECHA_ENT = command.fecha
        params.SUCURSAL = command.sucursal ?: '%'
        def pdf = this.reportService.run('RecepDeMercancia', params)
        def fileName = "RecepDeMercancia.pdf"
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: fileName)
    }
}

class RecepcionesPorFecha {
    Date fecha
    String sucursal

    static constraints = {
        sucursal nullable: true
    }
}