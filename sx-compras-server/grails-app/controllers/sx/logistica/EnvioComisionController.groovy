package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.http.HttpStatus
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class EnvioComisionController extends RestfulController<EnvioComision> {

    static responseFormats = ['json']

    ReportService reportService

    EnvioComisionService envioComisionService

    EnvioComisionController() {
        super(EnvioComision)
    }

    @Override
    @CompileDynamic
    protected List<EnvioComision> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros?: 3000
        log.info('List: {}', params)
        def query = EnvioComision.where{}

        if(params.periodo) {
            def periodo = params.periodo
            query = query.where{regreso >= periodo.fechaInicial && regreso <= periodo.fechaFinal}
        }
        if(params.sucursal) {
            query = query.where {sucursal.id == params.sucursal}
        }
        return query.list(params)
    }

    def generar() {
        log.info('Generar: {}', params)
        Periodo periodo = new Periodo()
        bindData(periodo, getObjectToBind())
        envioComisionService.generarComisiones(periodo.fechaInicial, periodo.fechaFinal)
        List<EnvioComision> res = envioComisionService.calcularComisiones(periodo)

        log.info('{} comisiones genradas para el periodo: {}', res.size(), periodo)
        respond res

    }


}
