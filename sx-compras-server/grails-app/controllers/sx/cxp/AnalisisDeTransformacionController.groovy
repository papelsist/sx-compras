package sx.cxp


import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic
import groovy.transform.Canonical

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo
import sx.inventario.Transformacion
import sx.inventario.TransformacionDet

@Slf4j
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class AnalisisDeTransformacionController extends RestfulController<AnalisisDeTransformacion> {
    
    static responseFormats = ['json']

    ReportService reportService

    AnalisisDeTransformacionService analisisDeTransformacionService

    AnalisisDeTransformacionController() {
        super(AnalisisDeTransformacion)
    }

    @Override
    @CompileDynamic
    protected List<AnalisisDeTransformacion> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = 5000
        // log.info('List {}', params)
        Periodo periodo = params.periodo
        def query = AnalisisDeTransformacion.where{}
        return  query.list(params)
    }
    
    def update() {
        String id = params.id as String
        AnalisisDeTransformacion analisis = AnalisisDeTransformacion.get(id)
        bindData analisis, getObjectToBind()
        analisis = analisisDeTransformacionService.update(analisis)
        respond analisis, view: 'show'
    }

    def pendientesDeAnalisis() {
        String id = params.proveedorId
        List<CuentaPorPagar> res = CuentaPorPagar
            .findAll("""
                from CuentaPorPagar c 
                where c.proveedor.id = ? 
                  and c not in(select x.cxp from AnalisisDeTransformacion x)
                """, [id])
        respond res
    }

    def pendientes() {
        // log.info('Localizando TRS pendientes: {}', params)
        def res = TransformacionDet.findAll("""
            select new sx.cxp.TrsDetalleDto(
                d.id, 
                p.sucursal.nombre,
                p.documento,
                p.fecha,
                d.producto.clave,
                d.producto.descripcion,
                d.producto.unidad,
                d.cantidad
                )
            from TransformacionDet d 
            join d.transformacion p 
            where p.tipo = ? 
              and d.cantidad > 0
              and d not in(select x.trs from AnalisisDeTransformacionDet x)
            """, ['MET'])
        respond res
    }

    def print( ) {
        Map repParams = [ID: params.id]
        def pdf =  reportService.run('cxp/AnalisisDeTransformacion.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'AnalisisDeTransformacion.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

@Canonical
class TrsDetalleDto {
    String trs
    String sucursal
    Long trsFolio
    Date trsFecha
    String clave
    String descripcion
    String unidad
    BigDecimal cantidad = 0.0
    BigDecimal costo = 0.0
    BigDecimal importe = 0.0
}
