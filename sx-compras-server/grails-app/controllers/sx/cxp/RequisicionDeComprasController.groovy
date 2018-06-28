package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
import sx.reports.ReportService
import sx.utils.Periodo

@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@GrailsCompileStatic
class RequisicionDeComprasController extends RestfulController<RequisicionDeCompras> {

    static responseFormats = ['json']

    RequisicionDeComprasService requisicionDeComprasService

    ReportService reportService

    RequisicionDeComprasController() {
        super(RequisicionDeCompras)
    }

    @Override
    @CompileDynamic
    protected List<RequisicionDeCompras> listAllResources(Map params) {
        params.max = 200
        params.sort = 'fecha'
        params.order = 'asc'
        log.debug('List {}', params)
        def query = RequisicionDeCompras.where{}

        if(params.fechaInicial) {
            def periodo = new Periodo()
            periodo.properties = params
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }
        def nombre = params.nombre
        if(nombre) {
            String search = nombre + '%'
            query = query.where { nombre =~ search  }
        }

        respond query.list(params);
    }

    @Override
    protected RequisicionDeCompras saveResource(RequisicionDeCompras resource) {
        return requisicionDeComprasService.save(resource)
    }

    @CompileDynamic
    protected RequisicionDeCompras createResource() {
        RequisicionDeCompras res = new RequisicionDeCompras()
        bindData res, getObjectToBind()
        res.folio = 0L
        res.createUser = 'TEMPO'
        res.updateUser = 'TEMPO'
        if(!res.nombre)
            res.nombre = res.proveedor.nombre
        return res
    }
}
