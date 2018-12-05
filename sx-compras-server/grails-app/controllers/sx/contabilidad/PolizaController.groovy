package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.core.GrailsApplication
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService
import sx.utils.Periodo



@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class PolizaController extends RestfulController<Poliza> {

    static responseFormats = ['json']

    PolizaService polizaService

    ReportService reportService

    GrailsApplication grailsApplication

    PolizaController() {
        super(Poliza)
    }

    @Override
    protected List<Poliza> listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        params.ejercicio = params.ejercicio?: Periodo.currentYear()
        params.mes = params.mes?: Periodo.currentMes()
        log.debug('List : {}', params)

        def criteria = new DetachedCriteria(Poliza).build {
            eq('ejercicio', this.params.getInt('ejercicio'))
            eq('mes', this.params.getInt('mes'))
            eq('tipo', params.tipo)
            eq('subtipo', params.subtipo)
        }
        return criteria.list(params)
    }


    def save(PolizaCreateCommand command) {
        if(command == null) {
            notFound()
            return
        }
        Poliza poliza = new Poliza()
        poliza.properties = command

        String pname = polizaService.resolverProcesador(poliza)
        ProcesadorDePoliza procesador = (ProcesadorDePoliza)grailsApplication.mainContext.getBean(pname)
        poliza.concepto = procesador.definirConcepto(poliza)

        poliza = polizaService.salvarPolza(poliza)
        respond poliza

    }


    @Override
    protected Poliza updateResource(Poliza resource) {
        ProcesadorDePoliza procesador = getProcesador(resource)
        resource.partidas.clear()
        resource = procesador.recalcular(resource)
        return polizaService.updatePoliza(resource)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        // e.printStackTrace()
        log.error(message, e)
        respond([message: message], status: 500)
    }

    ProcesadorDePoliza getProcesador(Poliza poliza) {
        String pname = polizaService.resolverProcesador(poliza)
        ProcesadorDePoliza procesador = (ProcesadorDePoliza)grailsApplication.mainContext.getBean(pname)
        return procesador
    }


}

class PolizaCreateCommand  {

    Integer ejercicio
    Integer mes
    String tipo
    String subtipo
    Integer folio
    Date fecha

    static constraints = {
        importFrom Poliza
    }

}