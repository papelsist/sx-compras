package sx.compras

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.AppConfig
import sx.core.ProveedorProducto
import sx.reports.ReportService
import sx.utils.Periodo


@Slf4j
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class CambioDePrecioController extends RestfulController<CambioDePrecio> {
    
    static responseFormats = ['json']

    CambioDePrecioService cambioDePrecioService

    ReportService reportService

    CambioDePrecioController() {
        super(CambioDePrecio)
    }

    @Override
    @CompileDynamic
    protected List<RequisicionDeMaterial> listAllResources(Map params) {
        log.info('List {}', params)
        Periodo periodo = params.periodo
        def query = CambioDePrecio.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return  query.list([sort: 'lastUpdated', order: 'desc'])
    }

}
