package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.transform.CompileDynamic
import groovy.transform.ToString
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

    def batchUpdate(EnvioComisionBatchUpdate command) {
        if(command == null) {
            notFound()
            return
        }
        command.validate()
        if(command.hasErrors()) {
            respond command.errors, view:'edit' // STATUS CODE 422
            return

        }
        log.info('BatchUpdate de: {}', command)
        List<EnvioComision> res = []
        command.registros.each {
            bindData(it, command)
            it.manual = true
            res << envioComisionService.calcular(it)

        }
        respond res
    }


}

@ToString( includeNames = true, excludes = ['registros'])
class EnvioComisionBatchUpdate  implements  Validateable{


    BigDecimal comision = 0.0
    BigDecimal precioTonelada = 0.0
    String comentarioDeComision

    List<EnvioComision>  registros

    static constraints = {
        comentarioDeComision nullable: true
        precioTonelada nullable: true
    }

}
