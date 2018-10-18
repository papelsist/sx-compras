package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
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
        params.max = 20
        def query = CuentaDeBanco.where{}

        if(params.activas) {
            query = query.where {activo == true}
        }
        if(params.disponibleEnPagos) {
            query = query.where {disponibleEnPagos == true}
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
}
