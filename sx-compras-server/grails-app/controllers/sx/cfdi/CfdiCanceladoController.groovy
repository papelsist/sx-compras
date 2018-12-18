package sx.cfdi

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.reports.ReportService
import sx.utils.Periodo


@Secured(['ROLE_CXC', 'ROLE_GASTOS', 'ROLE_TESORERIA'])
@GrailsCompileStatic
@Slf4j
class CfdiCanceladoController extends RestfulController<CancelacionDeCfdi> {

    static responseFormats = ['json']

    ReportService reportService

    CfdiCanceladoService cfdiCanceladoService

    CfdiCanceladoController() {
        super(CancelacionDeCfdi)
    }

    @Override
    // @CompileDynamic
    protected List listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros?: 10

        log.info('List: {}', params)

        def receptor = params.receptor?: '%'
        def criteria = new DetachedCriteria(Cfdi).build {

        }
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            criteria = criteria.build {
                // between('dateCreado', periodo.fechaInicial, periodo.fechaFinal)
            }
        }
        return criteria.list(params)
    }

    def pendientes() {
        // CuentaPorCobrar Todos los Cfdis pendientes de cancelar
        def criteria = new DetachedCriteria(Cfdi).build {
            eq('status', 'CANCELACION_PENDIENTE')
        }
        respond criteria.list([sort:'lastUpdated', order: 'asc'])
    }
}
