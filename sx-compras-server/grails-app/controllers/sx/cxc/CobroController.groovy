package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class CobroController extends RestfulController<Cobro> {
    static responseFormats = ['json']

    ReportService reportService
    CobroService cobroService

    CobroController() {
        super(Cobro)
    }

    @Override
    protected List<Cobro> listAllResources(Map params) {
        params.sort = params.sort ?: 'lastUpdated'
        params.order = params.order ?: 'desc'
        params.max = params.registros ?: 20
        params.tipo = params.tipo ?: 'CRE'

        log.info('List: {}', params)

        def query = Cobro.where { tipo == params.tipo}

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }

        if(params.nombre) {
            query = query.where {cliente.nombre =~ params.nombre}
        }
        return query.list(params)
    }
}
