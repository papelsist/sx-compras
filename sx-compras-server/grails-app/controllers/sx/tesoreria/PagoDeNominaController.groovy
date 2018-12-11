package sx.tesoreria


import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils
import sx.integracion.ImportadorDePagosDeNomina
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class PagoDeNominaController extends RestfulController<PagoDeNomina> {

    static responseFormats = ['json']

    PagoDeNominaService pagoDeNominaService

    ImportadorDePagosDeNomina importadorDePagosDeNomina

    ReportService reportService

    PagoDeNominaController() {
        super(PagoDeNomina)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'pago'
        params.order = params.order ?:'asc'

        log.debug('List : {}', params)
        Periodo periodo = (Periodo)params.periodo
        def pendientes = this.params.getBoolean('pendientes', true)

        def criteria = new DetachedCriteria(PagoDeNomina).build {
            between("lastUpdated", periodo.fechaInicial, periodo.fechaFinal)
        }
        if(pendientes) {
            criteria = criteria.build {
                isNull('egreso')
            }
        }
        return criteria.list(params)
    }


    @Override
    protected PagoDeNomina saveResource(PagoDeNomina resource) {
        return pagoDeNominaService.save(resource)
    }

    @Override
    protected void deleteResource(PagoDeNomina resource) {
        pagoDeNominaService.delete(resource.id)
    }

    def importar(ImportadorParaPagoDeNomina command){
        log.info('Importar {}', this.params)
        if(command == null){
            notFound()
            return
        }
        respond importadorDePagosDeNomina.importar(command.ejercicio, command.periodicidad, command.folio, command.tipo)
    }

    def pagar(PagoDeNominaCommand pago) {
        if(pago == null){
            notFound()
            return
        }

        PagoDeNomina pagoDeNomina =   pagoDeNominaService.pagar(pago.pagoDeNomina, pago.fecha, pago.cuenta, pago.referencia)
        respond pagoDeNomina
    }


    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

class ImportadorParaPagoDeNomina {
    Integer folio
    Integer ejercicio
    String periodicidad
    String tipo
}

class PagoDeNominaCommand {

    PagoDeNomina pagoDeNomina
    CuentaDeBanco cuenta
    String referencia
    Date fecha

    static constraints = {
        referencia nullable: true
    }
}
