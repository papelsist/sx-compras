package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class FacturistaPrestamoController extends RestfulController<FacturistaPrestamo> {

    static responseFormats = ['json']

    FacturistaPrestamoService facturistaPrestamoService

    ReportService reportService

    FacturistaPrestamoController() {
        super(FacturistaPrestamo)
    }

    @Override
    protected List<FacturistaPrestamo> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = 100

        log.info('List: {}', params)
        def query = FacturistaPrestamo.where{}

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return query.list(params)
    }

    @Override
    protected FacturistaPrestamo createResource() {
        FacturistaPrestamo prestamo = new FacturistaPrestamo()
        bindData(prestamo, getObjectToBind())
        prestamo.nombre = prestamo.facturista.nombre
        prestamo.cxc = facturistaPrestamoService.generarCuentaPorCobrar(prestamo)
        return prestamo
    }


    @Override
    protected FacturistaPrestamo saveResource(FacturistaPrestamo resource) {
        return facturistaPrestamoService.save(resource)
    }

    @Override
    protected FacturistaPrestamo updateResource(FacturistaPrestamo resource) {
        return facturistaPrestamoService.update(resource)
    }

    @Override
    protected void deleteResource(FacturistaPrestamo resource) {
        facturistaPrestamoService.deletePrestamo(resource)
    }
}
