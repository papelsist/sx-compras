package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService
import sx.utils.Periodo
import static org.springframework.http.HttpStatus.OK


@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class SaldoPorCuentaContableController extends RestfulController<SaldoPorCuentaContable> {

    static responseFormats = ['json']

    ReportService reportService

    SaldoPorCuentaContableService saldoPorCuentaContableService

    CierreAnualService cierreAnualService

    SaldoPorCuentaContableController() {
        super(SaldoPorCuentaContable)
    }

    @Override
    @CompileDynamic
    protected List<Poliza> listAllResources(Map params) {
        params.sort = params.sort ?:'clave'
        params.order = params.order ?:'asc'
        params.max = 9000

        Integer ejercicio = this.params.getInt('ejercicio')?: Periodo.currentYear()
        Integer mes = this.params.getInt('mes')?: Periodo.currentMes()

        // log.info('List {} {}', ejercicio, mes)

        def criteria = new DetachedCriteria(SaldoPorCuentaContable).build {
            eq('ejercicio', ejercicio)
            eq('mes', mes)
        }
        return criteria.list(params)
    }

    def actualizarSaldos(Integer ejercicio, Integer mes) {
        log.info('Actualizando saldos {} - {}', ejercicio, mes)
        saldoPorCuentaContableService.actualizarSaldos(ejercicio, mes)
        respond listAllResources(params)
    }

    def cierreMensual(Integer ejercicio, Integer mes) {
        log.info('Cierre mensual para  {} - {}', ejercicio, mes)
        saldoPorCuentaContableService.cierreMensual(ejercicio, mes)
        respond status: OK
    }

    def cierreAnual(Integer ejercicio) {
        log.info('Cierre Anual para  {} ', ejercicio)
        Poliza poliza = cierreAnualService.generarPolizaDeCierreAnual(ejercicio)
        // saldoPorCuentaContableService.actualizarSaldos(poliza)
        // saldoPorCuentaContableService.cierreMensual(ejercicio, 13)
        respond status: OK
    }

    def printAuxiliar( AuxiliarContableCommand command) {
        if(command == null) {
            notFound()
            return
        }
        log.info('Auxiliar contable para {}', command)
        command.validate()
        if (command.hasErrors()) {
            respond command.errors
            return
        }
        Map repParams = [
                EJERCICIO: command.ejercicio.toString(),
                MES: command.mes.toString(),
                CUENTA_ID: command.cuenta.id
        ]
        def pdf =  reportService.run('contabilidad/AuxiliarContable.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Poliza.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message)
        respond([message: message], status: 500)
    }
}

@ToString
class AuxiliarContableCommand implements Validateable{
    Integer ejercicio
    Integer mes
    CuentaContable cuenta
}
