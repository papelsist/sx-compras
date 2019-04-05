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
class FacturistaOtroCargoController extends RestfulController<FacturistaOtroCargo> {

    static responseFormats = ['json']

    FacturistaOtroCargoService facturistaOtroCargoService
 
    ReportService reportService

    FacturistaOtroCargoController() {
        super(FacturistaOtroCargo)
    }

    @Override
    protected List<FacturistaOtroCargo> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = 100

        log.info('List: {}', params)
        def query = FacturistaOtroCargo.where{}

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return query.list(params)
    }

    @Override
    protected FacturistaOtroCargo createResource() {
        FacturistaOtroCargo cargo = new FacturistaOtroCargo()
        bindData(cargo, getObjectToBind())
        cargo.nombre = cargo.facturista.nombre
        cargo.cxc = facturistaOtroCargoService.generarCuentaPorCobrar(cargo)
        return cargo
    }


    @Override
    protected FacturistaOtroCargo saveResource(FacturistaOtroCargo resource) {
        return facturistaOtroCargoService.save(resource)
    }

    @Override
    protected FacturistaOtroCargo updateResource(FacturistaOtroCargo resource) {
        return facturistaOtroCargoService.update(resource)
    }

    @Override
    protected void deleteResource(FacturistaOtroCargo resource) {
        facturistaOtroCargoService.deletePrestamo(resource)
    }
}
