package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.web.databinding.WebDataBinding
import groovy.beans.Bindable
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
        Date fechaInicial = command.fechaIni
        BigDecimal saldoInicial = MovimientoDeCuenta
                .findAll("select sum(m.importe) from MovimientoDeCuenta m where date(m.fecha) < ?  and m.porIdentificar = false",
                [fechaInicial])[0]?: 0.0 as BigDecimal
        List<MovimientoDeCuenta> movimientos = MovimientoDeCuenta
                .findAll("from MovimientoDeCuenta m where date(m.fecha) between ? and ? order by fecha",
                [fechaInicial, command.fechaFin])
        BigDecimal cargos = movimientos.sum 0.0, {it.importe<0 ? it.importe: 0.0}
        BigDecimal abonos = movimientos.sum 0.0, {it.importe>0 ? it.importe: 0.0}
        BigDecimal saldoFinal = saldoInicial + cargos + abonos

        EstadoDeCuenta estadoDeCuenta = new EstadoDeCuenta(
                cuenta: command.cuenta,
                saldoInicial:saldoInicial,
                cargos: cargos,
                abonos: abonos,
                saldoFinal: saldoFinal,
                movimientos: movimientos
        )
        respond([estadoDeCuenta: estadoDeCuenta])
        // respond([message: message], status: 500)

    }

    @CompileDynamic
    def estadoDeCuentaReport(EstadoDeCuentaCommand command) {

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
                .findAll("select sum(m.importe) from MovimientoDeCuenta m where date(m.fecha) < ?  and m.porIdentificar = false",
                [fechaInicial])[0]?: 0.0 as BigDecimal

        BigDecimal cargos = MovimientoDeCuenta
                .findAll("select sum(m.importe) from MovimientoDeCuenta m where date(m.fecha) between ? and ? and m.importe < 0",
                [fechaInicial, command.fechaFin])[0]?: 0.0 as BigDecimal

        BigDecimal abonos = MovimientoDeCuenta
                .findAll("select sum(m.importe) from MovimientoDeCuenta m where date(m.fecha) between ? and ? and m.importe > 0 and m.porIdentificar = false",
                [fechaInicial, command.fechaFin])[0]?: 0.0 as BigDecimal

        BigDecimal saldo = inicial + cargos + abonos

        repParams.INICIAL = inicial
        repParams.CARGOS = cargos
        repParams.ABONOS = abonos
        repParams.FINAL = saldo


        def pdf =  reportService.run('EstadoDeCuentaBancario.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EstadoDecuentaBancario.pdf')

    }

    @CompileDynamic
    def movimientosReport() {
        log.info('Imprimir movimientos: {}', params)
        ReporteDeMovimientos command = new ReporteDeMovimientos()
        command.cuenta = CuentaDeBanco.get(params.cuentaId)
        command.properties = getObjectToBind()
        log.info('Cuenta: {}', command.cuenta)
        log.info('Rows: {}', command.rows.size())

        Map reportParams = [
                FECHA_INI: command.fechaIni.format('dd/MM/yyyy'),
                FECHA_FIN: command.fechaFin.format('dd/MM/yyyy')
        ]
        /**
         * <field name="Banco" class="java.lang.String"/>
         * 	<field name="Cuenta" class="java.lang.Long"/>
         * 	<field name="Fecha" class="java.util.Date"/>
         * 	<field name="Concepto" class="java.lang.String"/>
         * 	<field name="Importe" class="java.math.BigDecimal"/>
         * 	<field name="TC" class="java.math.BigDecimal"/>
         * 	<field name="Referencia" class="java.lang.String"/>
         * 	<field name="Comentario" class="java.lang.String"/>
         * 	<field name="Origen" class="java.lang.String"/>
         * 	<field name="Conciliacion" class="java.lang.Boolean"/>
         * 	<field name="Descripcion" class="java.lang.String"/>
         */
        List<MovimientoDeCuenta> data = command.rows.collect { mov ->
            def res = [
                    Banco: mov.cuenta.descripcion,
                    Cuenta: mov.cuenta.numero,
                    Fecha: mov.fecha,
                    Importe: mov.importe,
                    TC: mov.tipoDeCambio,
                    Referencia: mov.referencia,
                    Comentario: mov.comentario,
                    Origen: mov.tipo,
                    Conciliacion: mov.porIdentificar,
                    Descripcion: mov.conceptoReporte
            ]
            return res
        }
        def pdf =  reportService.run('MovimientosDeCuentaBancaria.jrxml', reportParams, data)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Movimientos.pdf')
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

class EstadoDeCuenta {
    CuentaDeBanco cuenta
    BigDecimal saldoInicial
    BigDecimal cargos
    BigDecimal abonos
    BigDecimal saldoFinal
    List<MovimientoDeCuenta> movimientos

}

class ReporteDeMovimientos implements WebDataBinding {
    Date fechaIni
    Date fechaFin
    CuentaDeBanco cuenta
    List<MovimientoDeCuenta> rows
}
