package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.utils.Periodo
import static org.springframework.http.HttpStatus.OK


@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class SaldoPorCuentaContableController extends RestfulController<SaldoPorCuentaContable> {

    static responseFormats = ['json']

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

        log.info('List {} {}', ejercicio, mes)

        def criteria = new DetachedCriteria(SaldoPorCuentaContable).build {
            eq('ejercicio', ejercicio)
            eq('mes', mes)
        }
        return criteria.list(params)
    }

    def actualizarSaldos(Integer ejercicio, Integer mes) {
        log.info('Actualizando saldos {} - {}', ejercicio, mes)
        saldoPorCuentaContableService.actualizarSaldos(ejercicio, mes)
        redirect action: 'index'
    }

    def cierreMensual(Integer ejercicio, Integer mes) {
        log.info('Cierre mensual para  {} - {}', ejercicio, mes)
        saldoPorCuentaContableService.cierreMensual(ejercicio, mes)
        respond status: OK
    }

    def cierreAnual(Integer ejercicio) {
        log.info('Cierre Anual para  {} ', ejercicio)
        Poliza poliza = cierreAnualService.generarPolizaDeCierreAnual(ejercicio)
        saldoPorCuentaContableService.actualizarSaldos(poliza)
        // saldoPorCuentaContableService.cierreMensual(ejercicio, 13)
        respond status: OK
    }
}
