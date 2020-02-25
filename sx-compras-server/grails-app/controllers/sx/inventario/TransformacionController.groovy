package sx.inventario

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class TransformacionController extends RestfulController<Transformacion> {

    static responseFormats = ['json']

    ReportService reportService

    TransformacionController() {
        super(Transformacion)
    }

    
    protected List<Transformacion> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'

        log.info('List: {}', params)
        def query = Transformacion.where{}

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        if(params.tipo) {
            String stipo = params.tipo as String
            query = query.where{tipo == stipo}
        }
        return query.list(params)
    }

    @Override
    protected Transformacion updateResource(Transformacion resource) {
        return resource.save(flush: true)
    }

    
}
