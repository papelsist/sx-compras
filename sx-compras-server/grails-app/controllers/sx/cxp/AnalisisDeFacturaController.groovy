package sx.cxp

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.ToString
import sx.core.Producto
import sx.core.Proveedor
import sx.core.Sucursal
import sx.reports.ReportService

import sx.reports.SucursalPeriodoCommand
import sx.utils.Periodo

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class AnalisisDeFacturaController extends RestfulController<AnalisisDeFactura> {
    static responseFormats = ['json']

    // static namespace = 'cxp'

    AnalisisDeFacturaService analisisDeFacturaService

    ReportService reportService

    AnalisisDeFacturaController() {
        super(AnalisisDeFactura)
    }

    @Override
    protected List<AnalisisDeFactura> listAllResources(Map params) {

        params.max = 1000
        params.sort = 'lastUpdated'
        params.order = 'desc'
        log.info('List: {}', params)
        def query = AnalisisDeFactura.where {}
        if(params.periodo) {
            Periodo periodo = params.periodo
            query = query.where { fechaEntrada >= periodo.fechaInicial && fechaEntrada <= periodo.fechaFinal}
        }
        return query.list(params)
    }

    @Override
    protected AnalisisDeFactura createResource() {
        AnalisisDeFactura analisisDeFactura  = new AnalisisDeFactura()
        bindData analisisDeFactura, getObjectToBind()
        analisisDeFactura.createUser = 'PENDIENTE'
        analisisDeFactura.updateUser = 'PENDIENTE'
        analisisDeFactura.folio = 0L
        return analisisDeFactura
    }

    @Override
    protected AnalisisDeFactura saveResource(AnalisisDeFactura resource) {
        return this.analisisDeFacturaService.save(resource)
    }

    @Override
    protected AnalisisDeFactura updateResource(AnalisisDeFactura resource) {
        return analisisDeFacturaService.update(resource)
    }

    @Override
    protected void deleteResource(AnalisisDeFactura resource) {
        analisisDeFacturaService.delete(resource)
    }

    def cerrar(AnalisisDeFactura analisis) {
        if(analisis == null) {
            notFound()
            return
        }
        analisis = analisisDeFacturaService.cerrar(analisis)
        respond analisis
    }

    def print( ) {
        Map repParams = [ID: params.id]
        repParams.MONEDA = params.moneda
        def pdf =  reportService.run('AnalisisDeFactura.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'AnalisisDeFactura.pdf')
    }

    def entradasAnalizadas(SucursalPeriodoCommand command) {
        def pdf =  reportService.run('EntradasAnalizadas.jrxml', command.toReportMap())
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EntradasAnalizadas.pdf')
    }

    def comsSinAnalizar(ComsSinAnalizarCommand command) {

        Map repParams = [:]
        repParams.FECHA_INI = command.fechaIni
        repParams.FECHA_FIN = command.fechaFin
        repParams.PROVEEDOR = command.proveedor ? command.proveedor.id : '%'
        repParams.ARTICULOS = command.producto ? command.producto.id : '%'
        repParams.SUCURSAL = command.sucursal ? command.sucursal.id : '%'

        def pdf =  reportService.run('Com_SinAnalizar_General.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Com_SinAnalizar_General.pdf')

    }
}

// @ToString(includeNames=true,includePackage=false)
class ComsSinAnalizarCommand {

    Date fechaIni
    Date fechaFin
    Producto producto
    Proveedor proveedor
    Sucursal sucursal

    static constraints = {
        proveedor nullable: true
        sucursal nullable: true
        producto nullable: true

    }



}
