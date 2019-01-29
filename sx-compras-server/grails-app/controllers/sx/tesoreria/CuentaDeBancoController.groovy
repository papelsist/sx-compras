package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.web.databinding.WebDataBinding
import groovy.beans.Bindable
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo

@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@Slf4j
class CuentaDeBancoController extends RestfulController {

    static responseFormats = ['json']

    ReportService reportService

    SaldoPorCuentaDeBancoService saldoPorCuentaDeBancoService

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
        List<SaldoPorCuentaDeBanco> res = SaldoPorCuentaDeBanco.where {cuenta == cuenta}.list(params)
        respond res
    }

    @CompileDynamic
    def estadoDeCuenta3(EstadoDeCuentaCommand command) {
        log.info('Estado de cuenta: {}', params)
        log.info('F.Ini:{} F.Fin:{} Cta:{} ', command.fechaIni.format('dd/MM/yyyy'), command.fechaFin.format('dd/MM/yyyy'), command.cuenta)

        Date inicioOperativo = Date.parse('dd/MM/yyyy', '31/12/2017')
        BigDecimal saldoInicial = MovimientoDeCuenta
                .findAll("""
                    select sum(m.importe) from MovimientoDeCuenta m
                     where date(m.fecha) < ?  
                       and date(m.fecha) >= ?
                       and m.cuenta.id = ?
                       and m.porIdentificar = false
                """,
                [command.fechaIni, inicioOperativo, command.cuenta.id],)[0]?: 0.0 as BigDecimal
        log.info('Saldo inicial: {}', saldoInicial)

        List<MovimientoDeCuenta> movimientos = MovimientoDeCuenta
                .findAll("""
                    from MovimientoDeCuenta m 
                      where date(m.fecha) between ? and ?
                        and m.cuenta.id = ? 
                      order by fecha 
                """,
                [command.fechaIni, command.fechaFin, command.cuenta.id])
        List<Cheque> cancelados = Cheque
                .findAll(
                "from Cheque c where c.fecha between ? and ? and c.cuenta = ? and c.cancelado != null",
            [command.fechaIni, command.fechaFin, command.cuenta])
        cancelados.each {
            MovimientoDeCuenta mv = new MovimientoDeCuenta()
            mv.cuenta = command.cuenta
            mv.fecha = it.fecha
            mv.referencia = it.folio.toString()
            mv.comentario = it.nombre
            mv.afavor = it.nombre
            mv.cheque = it
            mv.formaDePago = 'CHEQUE'
            mv.tipo = 'CHE_CANCELADO'
            mv.sucursal = 'OFICINAS'
            mv.importe = 0.0
            mv.conceptoReporte = "CHEQUE CANCELADO: ${it.folio}"
            mv.concepto = 'CHE_CANCELADO'
            mv.dateCreated = it.dateCreated
            mv.lastUpdated = it.lastUpdated
            mv.createUser = it.createUser
            mv.updateUser = it.updateUser
            movimientos << mv
        }

        Long row = 1
        movimientos.each {
            if(it.formaDePago == 'TARJETA') {
                it.orden = row++
            }
        }
        movimientos.each {
            if(it.importe > 0) {
                saldoPorCuentaDeBancoService.actulizarFechaDeposito(it)
            }
        }
        log.info('Movimientos: {}', movimientos.size())

        BigDecimal cargos = movimientos.findAll{!it.porIdentificar}.sum 0.0, {it.importe < 0.0 ? it.importe: 0.0}
        BigDecimal abonos = movimientos.findAll{!it.porIdentificar}.sum 0.0, {it.importe > 0.0 ? it.importe: 0.0}
        BigDecimal saldoFinal = saldoInicial + cargos + abonos

        EstadoDeCuenta estadoDeCuenta = new EstadoDeCuenta(
                cuenta: command.cuenta,
                saldoInicial:saldoInicial,
                cargos: cargos,
                abonos: abonos,
                saldoFinal: saldoFinal,
                movimientos: movimientos
        )
        log.info("inicial:{}, cargos: {} abonos: {}, saldo:{}", saldoInicial, cargos, abonos, saldoFinal)
        respond([estadoDeCuenta: estadoDeCuenta])

    }

    @CompileDynamic
    def estadoDeCuenta(EstadoDeCuentaCommand command) {
        // log.info('Estado de cuenta: {}', params)
        log.info('Estado de cuenta F.Ini:{} F.Fin:{} Cta:{} ',
                command.fechaIni.format('dd/MM/yyyy'),
                command.fechaFin.format('dd/MM/yyyy'),
                command.cuenta)

        BigDecimal saldoInicial = saldoPorCuentaDeBancoService.calcularSaldoInicial(command.cuenta, command.fechaIni)
        List<MovimientoDeCuenta> movimientos = saldoPorCuentaDeBancoService
                .movimientos(command.cuenta, command.fechaIni, command.fechaFin)
        Long row = 1
        movimientos.each {
            if(it.formaDePago == 'TARJETA') {
                it.orden = row++
            }
        }
        movimientos.each {
            if(it.importe > 0) {
                saldoPorCuentaDeBancoService.actulizarFechaDeposito(it)
            }
        }
        // log.info('Movimientos: {}', movimientos.size())

        BigDecimal cargos = movimientos.findAll{!it.porIdentificar}.sum 0.0, {it.importe < 0.0 ? it.importe: 0.0}
        BigDecimal abonos = movimientos.findAll{!it.porIdentificar}.sum 0.0, {it.importe > 0.0 ? it.importe: 0.0}
        BigDecimal saldoFinal = saldoInicial + cargos + abonos

        EstadoDeCuenta estadoDeCuenta = new EstadoDeCuenta(
                cuenta: command.cuenta,
                saldoInicial:saldoInicial,
                cargos: cargos,
                abonos: abonos,
                saldoFinal: saldoFinal,
                movimientos: movimientos
        )
        // log.info("inicial:{}, cargos: {} abonos: {}, saldo:{}", saldoInicial, cargos, abonos, saldoFinal)
        respond([estadoDeCuenta: estadoDeCuenta])

    }

    @CompileDynamic
    def estadoDeCuentaReport() {
        log.info('Imprimir estado de cuenta: {}', params)
        ReporteDeMovimientos command = new ReporteDeMovimientos()
        command.cuenta = CuentaDeBanco.get(params.cuentaId)
        command.properties = getObjectToBind()

        log.info('Cuenta: {}', command.cuenta)
        log.info('Rows: {}', command.rows.size())
        log.info('Fecha Ini: {}', command.fechaIni)

        log.info('Estado de cuenta')
        Map repParams = [:]
        repParams.FECHA_INICIAL = command.fechaIni
        repParams.FECHA_FINAL = command.fechaFin
        repParams.CUENTA_ID = command.cuenta.id

        /*
        Date fechaInicial = command.fechaIni
        Date inicioOperativo = Date.parse('dd/MM/yyyy', '31/12/2017')
        BigDecimal inicial = MovimientoDeCuenta
                .findAll("""
                    select sum(m.importe) from MovimientoDeCuenta m 
                     where m.cuenta.id=? 
                       and date(m.fecha) < ? 
                       and date(m.fecha) >= ? 
                       and m.porIdentificar = false
                """,
                [command.cuenta.id, fechaInicial, inicioOperativo])[0]?: 0.0 as BigDecimal


        BigDecimal cargos = MovimientoDeCuenta.findAll(
                """
                select sum(m.importe) from MovimientoDeCuenta m 
                 where m.cuenta.id = ? 
                    and date(m.fecha) between ? and ? 
                    and m.importe < 0 
                    and m.porIdentificar = false
                """,
                [command.cuenta.id, fechaInicial, command.fechaFin])[0]?: 0.0 as BigDecimal

        BigDecimal abonos = MovimientoDeCuenta.findAll(
                """
                    select sum(m.importe) from MovimientoDeCuenta m 
                     where m.cuenta.id = ? 
                      and date(m.fecha) between ? and ? 
                      and m.importe > 0 
                      and m.porIdentificar = false
                """,
                [command.cuenta.id, fechaInicial, command.fechaFin])[0]?: 0.0 as BigDecimal
        BigDecimal saldo = inicial + cargos + abonos
        */
        BigDecimal inicial = params.saldoInicial as BigDecimal
        BigDecimal cargos = params.cargos as BigDecimal
        BigDecimal abonos = params.abonos as BigDecimal
        BigDecimal saldo = params.saldoFinal as BigDecimal

        repParams.INICIAL = inicial
        repParams.CARGOS = cargos
        repParams.ABONOS = abonos
        repParams.FINAL = saldo

        /**
         * <field name="dia" class="java.lang.Long"/>
         * 	<field name="fecha" class="java.sql.Date"/>
         * 	<field name="id" class="java.lang.String"/>
         * 	<field name="numero" class="java.lang.String"/>
         * 	<field name="descripcion" class="java.lang.String"/>
         * 	<field name="concepto" class="java.lang.String"/>
         * 	<field name="forma_de_pago" class="java.lang.String"/>
         * 	<field name="saldo_inicial" class="java.math.BigDecimal"/>
         * 	<field name="saldo_final" class="java.math.BigDecimal"/>
         * 	<field name="egresos" class="java.math.BigDecimal"/>
         * 	<field name="ingresos" class="java.math.BigDecimal"/>
         * 	<field name="referencia" class="java.lang.String"/>
         * 	<field name="comentario" class="java.lang.String"/>
         * 	<field name="cargo" class="java.math.BigDecimal"/>
         * 	<field name="abono" class="java.math.BigDecimal"/>
         * 	<field name="orden" class="java.lang.String"/>
         * 	<field name="date_created" class="java.sql.Timestamp"/>
         * 	<field name="origen" class="java.lang.String"/>
         */
        List<MovimientoDeCuenta> data = command.rows.findAll{!it.porIdentificar}.collect { mov ->
            def res = [
                    dia: mov.fecha.format('dd').toLong(),
                    fecha: mov.fecha,
                    id: mov.id,
                    numero: mov.cuenta.numero,
                    descripcion: mov.cuenta.descripcion,
                    concepto: mov.conceptoReporte,
                    forma_de_pago: mov.formaDePago,
                    saldo_inicial: 0.0,
                    ingresos: 0.0,
                    ingresos: 0.0,
                    referencia: mov.referencia,
                    comentario: mov.comentario,
                    cargo: mov.importe < 0 ? mov.importe : 0.0,
                    abono: mov.importe > 0 ? mov.importe : 0.0,
                    orden: '',
                    date_created: mov.dateCreated,
                    origen: mov.tipo.substring(0, 3)
            ]
            return res

        }

        def pdf =  reportService.run('EstadoDeCuentaBancario.jrxml', repParams, data)
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
        log.info('Fecha Ini: {}', command.fechaIni)

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

            String comentario = mov.comentario
            if(mov.fechaDeposito) {
                comentario = 'Pago dep:' + mov.fechaDeposito.format('dd/MM/yyyy')
            }

            def res = [
                    Banco: mov.cuenta.descripcion,
                    Cuenta: mov.cuenta.numero.toString(),
                    Fecha: mov.fecha,
                    Importe: mov.importe,
                    TC: mov.tipoDeCambio,
                    Referencia: mov.referencia,
                    Comentario: comentario,
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
        // e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

class EstadoDeCuentaCommand {
    CuentaDeBanco cuenta
    Date fechaIni
    Date fechaFin
    List<MovimientoDeCuenta> rows
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
