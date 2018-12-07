package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService
import sx.utils.Periodo

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CuentaDeBancoController extends RestfulController {

    static responseFormats = ['json']

    ReportService reportService

    CuentaDeBancoController() {
        super(CuentaDeBanco)
    }

    @Override
    protected List listAllResources(Map params) {
        params.max = 100
        log.info('List {}', params)
        def query = CuentaDeBanco.where{}

        if(params.activas) {
            query = query.where {activo == true}
        }
        if( this.params.getBoolean('disponibleEnPagos')) {
            query = query.where {disponibleEnPagos == this.params.getBoolean('disponibleEnPagos')}
        }
        if(params.cuentaConcentradora) {
            query = query.where{cuentaConcentradora == true}
        }
        if(params.tipo) {
            query = query.where{ tipo == params.tipo}
        }
        return query.list(params)
    }


    @CompileDynamic
    protected Object updateResource(CuentaDeBanco resource) {
        if(isLoggedIn()) {
            resource.updateUser = getAuthenticatedUser().username
        }
        return super.updateResource(resource)
    }

    @CompileDynamic
    def movimientos(CuentaDeBanco cuenta, Integer ejercicio, Integer mes) {
        if(cuenta == null) {
            notFound()
            return
        }
        // params.max = 100
        params.sort = 'lastUpdated'
        params.order = 'desc'
        Periodo periodo = Periodo.getPeriodoEnUnMes(mes - 1, ejercicio)
        log.info('Movimientos: {}', params)
        log.info('Periodo de movimientos: {}', periodo)

        def c = MovimientoDeCuenta.createCriteria()
        def res = c.list {
            eq("cuenta", cuenta)
            sqlRestriction("year(fecha) = ? and month(fecha) = ? ", [ejercicio, mes])
        }
        // List<MovimientoDeCuenta> res = MovimientoDeCuenta.where {cuenta == cuenta}.list(params)
        respond res
    }

    def saldos(CuentaDeBanco cuenta) {
        if(cuenta == null) {
            notFound()
            return
        }
        params.max = 50
        params.sort = 'lastUpdated'
        params.order = 'desc'
        // log.info('Saldos: {}', params)
        List<SaldoPorCuentaDeBanco> res = SaldoPorCuentaDeBanco.where {cuenta == cuenta}.list(params)
        respond res
    }

    @CompileDynamic
    def estadoDeCuenta(EstadoDeCuentaCommand command) {

        Map repParams = [:]
        repParams.FECHA_INICIAL = command.fechaIni
        repParams.FECHA_FINAL = command.fechaFin
        repParams.CUENTA_ID = command.cuenta.id

        Date fechaInicial = command.fechaIni
        Calendar cal = Calendar.getInstance()
        cal.setTime(fechaInicial)
        cal.set(Calendar.DATE,1)
        Date inicioDeMes = cal.getTime()

        BigDecimal inicial = MovimientoDeCuenta
                .findAll("select sum(m.importe) from MovimientoDeCuenta m where date(m.fecha) < ? ",
                [fechaInicial])[0]?: 0.0 as BigDecimal

        BigDecimal cargos = MovimientoDeCuenta
                .findAll("select sum(m.importe) from MovimientoDeCuenta m where date(m.fecha) between ? and ? and m.importe < 0",
                [inicioDeMes, fechaInicial])[0]?: 0.0 as BigDecimal

        BigDecimal abonos = MovimientoDeCuenta
                .findAll("select sum(m.importe) from MovimientoDeCuenta m where date(m.fecha) between ? and ? and m.importe > 0",
                [inicioDeMes, fechaInicial])[0]?: 0.0 as BigDecimal

        BigDecimal saldo = inicial + cargos + abonos

        repParams.INICIAL = inicial
        repParams.CARGOS = cargos
        repParams.ABONOS = abonos
        repParams.FINAl = saldo


        def pdf =  reportService.run('EstadoDeCuentaBancario.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EstadoDecuentaBancario.pdf')

    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

class EstadoDeCuentaCommand {
    CuentaDeBanco cuenta
    Date fechaIni
    Date fechaFin
}
