package sx.cfdi

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

import sx.reports.ReportService
import sx.utils.Periodo

@Secured(['ROLE_CXC', 'ROLE_GASTOS', 'ROLE_TESORERIA'])
@GrailsCompileStatic
@Slf4j
class CfdiController extends RestfulController<Cfdi> {

    static responseFormats = ['json']

    ReportService reportService

    CfdiController() {
        super(Cfdi)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros?: 10

        log.info('List: {}', params)

        def receptor = params.emisor?: '%'
        def criteria = new DetachedCriteria(Cfdi).build {
            ilike('emisor', receptor)
        }
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            criteria = criteria.build {
                between('fecha', periodo.fechaInicial, periodo.fechaFinal)
            }
        }
        return criteria.list(params)
    }


    def search(SearchCfdi command) {
        def criteria = new DetachedCriteria(Cfdi).build {
            between('fecha', command.fechaIni, command.fechaFin)
            ilike('receptor', command.receptor)
        }
        respond criteria.list(params)
    }


}

class SearchCfdi {
    Date fechaIni
    Date fechaFin
    String receptor

    static constraints = {
        receptor nullable: true
    }
}

