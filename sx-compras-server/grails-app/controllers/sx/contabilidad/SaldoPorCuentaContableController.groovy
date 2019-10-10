package sx.contabilidad

import groovy.transform.Canonical
import groovy.transform.ToString
import groovy.util.logging.Slf4j

import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable


import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo
import static org.springframework.http.HttpStatus.OK


@Slf4j
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
    protected List<Poliza> listAllResources(Map params) {

        println params

        params.sort = params.sort ?:'clave'
        params.order = params.order ?:'asc'
        params.max = 90000

        Integer ejercicio = this.params.getInt('ejercicio')?: Periodo.currentYear()
        Integer mes = this.params.getInt('mes')?: Periodo.currentMes()
        Integer nivel = this.params.getInt('nivel',1)

        log.info('List {} {}', ejercicio, mes)

        def criteria = new DetachedCriteria(SaldoPorCuentaContable).build {
            eq('ejercicio', ejercicio)
            eq('mes', mes)
            eq('nivel', nivel ? nivel : '%')
        }
        return criteria.list(params)
    }

    @Override
    protected SaldoPorCuentaContable updateResource(SaldoPorCuentaContable saldo) {
        saldo = saldoPorCuentaContableService.actualizarSaldo(saldo.cuenta, saldo.ejercicio, saldo.mes)

        return saldo

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

    def loadMovimientos() {
        log.info('Localizando movimientos: {}', params)
        CuentaContable cta = CuentaContable.get(params.cuenta)
        Periodo periodo = params.periodo

        List movimientos = []
        Integer eje = Periodo.obtenerYear(periodo.fechaInicial)
        Integer m = Periodo.obtenerMes(periodo.fechaInicial) + 1

        /*
        if(cta.detalle) {
            movimientos = PolizaDet.where{
                poliza.ejercicio == eje &&
                poliza.mes == m &&
                cuenta == cta &&
                poliza.cierre != null
            }.list()
        }
        */
        if(cta.padre) {
            def parts = cta.clave.split('-')
            def nivel = cta.nivel
            def ccv = ''
            def limit = nivel - 1
            0.upto(limit, {
                ccv += parts[it]
                ccv += "-"
                if(it == limit)
                ccv += "%"
               println "Number ${parts[it]}"
            })
            log.info('Buscando movimientos para {}', ccv)
            // movimientos = PolizaDet.findAll("from PolizaDet d where d.poliza.ejercicio = ? and d.poliza.mes = ? and d.cuenta.clave like ?" , [2018, 1, ccv])
            movimientos = PolizaDet.findAll("""
                from PolizaDet d where d.poliza.ejercicio = ? and d.poliza.mes = ? and d.cuenta.clave like ? and d.poliza.cierre != null
                """, [eje, m, ccv])
        }
        respond movimientos

    }

    @Override
    protected SaldoPorCuentaContable queryForResource(Serializable id) {
        SaldoPorCuentaContable saldo = SaldoPorCuentaContable.get(id)
        saldo.children = SaldoPorCuentaContable
                .where {cuenta.padre ==  saldo.cuenta &&
                        ejercicio == saldo.ejercicio &&
                        mes == saldo.mes
        }.list()
        List res = PolizaDet.findAll(
            """
            select new sx.contabilidad.PorPeriodoDTO(
                d.poliza.tipo, d.poliza.subtipo, d.poliza.folio, d.poliza.fecha, d.debe, d.haber
                )  
                from PolizaDet d 
                    where d.cuenta.clave = ? 
                    and d.poliza.ejercicio = ?
                    and d.poliza.mes = ?
            """,
            [saldo.cuenta.clave, saldo.ejercicio, saldo.mes])

        return saldo
    }

    def drill(SaldoPorCuentaContable saldo) {
        if(saldo == null) {
            notFound()
            return
        }
        SaldoDrillResult result = new SaldoDrillResult()
        result.parent = saldo
        if(saldo.cuenta.subcuentas) {

            result.children = SaldoPorCuentaContable.where {
                            cuenta.padre ==  saldo.cuenta &&
                            ejercicio == saldo.ejercicio &&
                            mes == saldo.mes
            }.list()
        }
        respond result, view: 'list'
    }

    def loadBalanza() {
        log.info('Balanza {}', params)
        params.sort = params.sort ?:'clave'
        params.order = params.order ?:'asc'
        // params.max = 9000

        Integer ejercicio = this.params.getInt('ejercicio')?: Periodo.currentYear()
        Integer mes = this.params.getInt('mes')?: Periodo.currentMes()

        

        def criteria = new DetachedCriteria(SaldoPorCuentaContable).build {
            eq('ejercicio', ejercicio)
            eq('mes', mes)
        }
        List<SaldoPorCuentaContable> saldos =  criteria.list([sort: 'clave', order: 'asc'])
        respond saldos
    }


    def drillPeriodo(AuxiliarContableCommand command){
         SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                .where{cuenta == command.cuenta && ejercicio == command.ejercicio && mes == command.mes}.find()

        List res = PolizaDet.findAll(
                """
                select new sx.contabilidad.PorPeriodoDTO(
                    d.poliza.tipo, d.poliza.subtipo, d.poliza.folio, d.poliza.fecha, sum(d.debe), sum(d.haber)
                    )  
                    from PolizaDet d 
                        where d.cuenta = ? 
                        and d.poliza.ejercicio = ? 
                        and d.poliza.mes = ?
                        group by d.poliza.tipo, d.poliza.subtipo, d.poliza.fecha
                """,
                [command.cuenta, command.ejercicio, command.mes])
        Map<Date, List<PorPeriodoDTO>> map = res.groupBy {it.fecha}
        BigDecimal acumulado = saldo.saldoInicial
        List data = map.collect { entry ->
            List<PorPeriodoDTO> list = entry.value
            BigDecimal debe = list.sum{it.debe}
            BigDecimal haber = list.sum{it.haber}
            acumulado = acumulado + debe - haber

            Map row = [
                    ejercicio: command.ejercicio,
                    mes: command.mes,
                    fecha: entry.key,
                    debe: debe,
                    haber: haber,
                    data: list,
                    acumulado: acumulado
            ]

            return row
        }
        Map resumen = [data: data, saldo: saldo, cuenta: saldo.cuenta]
        respond resumen
        
    }

    def reclasificar() {
        ReclasificarCommand command = new ReclasificarCommand()
        bindData(command, getObjectToBind())
        log.info('Reclasificando {} registros a la cuenta: {}', command.partidas.size(), command.destino)
        command.partidas.each {
            it.cuenta = command.destino
            it.concepto = command.destino.descripcion
            it.save flush: true
        }
        Map res = [cuenta: command.destino.clave, registros: command.partidas.size()]
        respond res
    }

    // Nuevo AUXILIAR CONTABLE
    def auxiliarContable() {
        def periodo = params.periodo
        def ctaInicial = CuentaContable.where{clave == params.cuentaInicial}.find()
        def ctaFinal = CuentaContable.where{clave == params.cuentaFinal}.find()
        respond saldoPorCuentaContableService.auxiliarContable(ctaInicial, ctaFinal, periodo)
    }

    def estadoDeResultados() {
        Map repParams = [
                YEAR: params.getInt('ejercicio'),
                MES: params.getInt('mes')
        ]
        def pdf =  reportService.run('contabilidad/EstadoDeResultados.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EstadoDeResultados.pdf')
    }

    def balanzaDeComprobacion() {
        Map repParams = [
                YEAR: params.getInt('ejercicio'),
                MES: params.getInt('mes')
        ]
        def pdf =  reportService.run('contabilidad/BalanzaDeComprobacion.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Balanza.pdf')
    }

    def balanceGeneral() {
        Map repParams = [
                YEAR: params.getInt('ejercicio'),
                MES: params.getInt('mes')
        ]
        def pdf =  reportService.run('contabilidad/BalanceGeneral.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'BalanceGeneral.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }
}

@ToString
class AuxiliarContableCommand implements Validateable{
    Integer ejercicio
    Integer mes
    CuentaContable cuenta
}

class DrillPorPeriodoCommand extends AuxiliarContableCommand{
    SaldoPorCuentaContable saldo
}

@ToString()
class DrillPorSubtipo  extends AuxiliarContableCommand {
    Date fecha
    List<String> subtipos

    static constraints = {
        fecha nullable: true
    }

}

@Canonical
class PorPeriodoDTO {
    String tipo
    String subtipo
    Integer folio
    Date fecha
    BigDecimal debe
    BigDecimal haber

}

@Canonical
class SaldoDrillResult {
    SaldoPorCuentaContable parent
    List<SaldoPorCuentaContable> children

}

@Canonical
class ReclasificarCommand implements  Validateable{
    CuentaContable destino
    List<PolizaDet> partidas
}
