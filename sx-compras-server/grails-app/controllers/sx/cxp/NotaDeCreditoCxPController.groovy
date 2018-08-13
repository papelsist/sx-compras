package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j
import sx.reports.ReportService
import sx.utils.Periodo


@Slf4j()
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class NotaDeCreditoCxPController extends RestfulController<NotaDeCreditoCxP>{

    static responseFormats = ['json']
    NotaDeCreditoCxPService notaDeCreditoCxPService
    ReportService reportService

    NotaDeCreditoCxPController() {
        super(NotaDeCreditoCxP)
    }

    @Override
    protected List<NotaDeCreditoCxP> listAllResources(Map params) {
        params.max = 200
        // log.debug('List {}', params)
        params.sort = 'lastUpdated'
        params.order = 'desc'
        def query = NotaDeCreditoCxP.where {}
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return query.list(params)
    }


    @Override
    protected NotaDeCreditoCxP updateResource(NotaDeCreditoCxP resource) {
        return notaDeCreditoCxPService.actualizarNota(resource)
    }

    def aplicar(NotaDeCreditoCxP nota) {
        if(nota == null) {
            notFound()
            return
        }
        nota = notaDeCreditoCxPService.aplicar(nota)
        respond nota
    }


}
