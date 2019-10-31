package sx.compras

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic
import groovy.transform.Canonical

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.compras.DevolucionDeCompraDet
import sx.cxp.NotaDeCreditoCxP
import sx.reports.ReportService
import sx.utils.Periodo
import sx.utils.MonedaUtils
import sx.reports.SucursalPeriodoCommand

@Slf4j
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class AnalisisDeDevolucionController extends RestfulController<AnalisisDeDevolucion> {
    
    static responseFormats = ['json']

    ReportService reportService

    AnalisisDeDevolucionService analisisDeDevolucionService

    AnalisisDeDevolucionController() {
        super(AnalisisDeDevolucion)
    }

    @Override
    protected List<AnalisisDeDevolucion> listAllResources(Map params) {
        // log.info('List {}', params)
        def notaId = params['notaDeCreditoCxPId'] 
        def query = AnalisisDeDevolucion.where{nota.id == notaId}
        return  query.list()
    }

    @Override()
    protected AnalisisDeDevolucion saveResource(AnalisisDeDevolucion resource) {
        return analisisDeDevolucionService.saveAnalisis(resource)
    }
    
    @Override()
    protected AnalisisDeDevolucion updateResource(AnalisisDeDevolucion resource) {
        def factor = resource.unidad == 'MIL' ? 1000 : 1
        def cantidad = resource.cantidad
        def importe = (cantidad / factor) * resource.costo
        resource.importe = MonedaUtils.round(importe, 2);
        return analisisDeDevolucionService.saveAnalisis(resource)
    }
    


    @Override()
    @CompileDynamic()
    protected AnalisisDeDevolucion createResource() {
        log.info('Creating Analisis {}', params)
        AnalisisDeDevolucion resource  = new AnalisisDeDevolucion()
        bindData resource, getObjectToBind()
        def nota = NotaDeCreditoCxP.get(params['notaDeCreditoCxPId'])
        if(nota == null) {
            notFound()
            return null
        }
        resource.nota = nota
        resource.with {
        	nombre = nota.nombre
        	folio = nota.folio
        	serie = nota.serie
        }
        return resource
    }

    def devolucionesPendientes() {
        log.info('Localizando devoluciones pendientes: {}', params)
        def res = DevolucionDeCompraDet.findAll("""
            select new sx.compras.DecDetalleDto(
                d.id, 
                p.sucursal.nombre,
                p.proveedor.nombre,
                p.documento,
                p.fecha,
                p.referencia,
                p.fechaReferencia,
                d.producto.clave,
                d.producto.descripcion,
                d.producto.unidad,
                d.cantidad
                )
            from DevolucionDeCompraDet d 
            join d.devolucionDeCompra p 
            where d not in(select x.dec from AnalisisDeDevolucion x)
              and d.devolucionDeCompra.proveedor.id = ?
            """, params['proveedorId'])
        respond res
    }

    @CompileDynamic()
    def reporteDeAnalisis(SucursalPeriodoCommand command) {
        log.info('Cmd: {}', command)
        Map repParams = [:] 
        repParams.FECHA_INI = command.fechaIni
        repParams.FECHA_FIN = command.fechaFin
        repParams.ARTICULOS = '%'
        repParams.SUCURSAL = command.sucursal

        def pdf =  reportService.run('compras/AnalisisDeDEC.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'AnalisisDeDEC.pdf')

    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }


}

@Canonical
class DecDetalleDto {
    String dec
    String sucursal
    String proveedor
    Long decFolio
    Date decFecha
    String referencia
    Date fechaReferencia
    String clave
    String descripcion
    String unidad
    BigDecimal cantidad = 0.0
    BigDecimal costo = 0.0
    BigDecimal importe = 0.0
}
