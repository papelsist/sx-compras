package sx.tesoreria

import grails.gorm.services.Service

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.utils.Periodo


@CompileDynamic
@Slf4j
@Service(SaldoPorCuentaDeBanco)
abstract class SaldoPorCuentaDeBancoService {

    abstract SaldoPorCuentaDeBanco save(SaldoPorCuentaDeBanco saldoPorCuentaDeBanco)

    SaldoPorCuentaDeBanco actualizarSaldo(String id, Integer ejercicio = Periodo.currentYear(), Integer mes = Periodo.currentMes()) {
        SaldoPorCuentaDeBanco saldo = find(CuentaDeBanco.get(id), ejercicio, mes)
        saldoInicial(saldo)
        ingresos(saldo)
        egresos(saldo)
        saldo.saldoFinal = saldo.saldoInicial + saldo.ingresos - saldo.egresos
        saldo = save(saldo)
        log.info('Saldo de cuenta:{} actializado Saldo final:{}', id, saldo.saldoFinal)
        return saldo
    }


    SaldoPorCuentaDeBanco find(CuentaDeBanco cuenta, Integer ejercicio, Integer mes) {
        return SaldoPorCuentaDeBanco.findOrCreateWhere(cuenta: cuenta, ejercicio: ejercicio, mes: mes)
    }

    void saldoInicial(SaldoPorCuentaDeBanco saldo) {
        Integer ejercicio = saldo.ejercicio
        Integer mes = saldo.mes - 1
        if(mes <= 0) {
            ejercicio = ejercicio - 1
            mes = 1
        }
        SaldoPorCuentaDeBanco anterior = find(saldo.cuenta, ejercicio, mes)
        saldo.saldoInicial = anterior ? anterior.saldoFinal : 0.0
    }

    @CompileDynamic
    void  ingresos(SaldoPorCuentaDeBanco saldo) {
        def c = MovimientoDeCuenta.createCriteria()
        def res = c.get {
            eq("cuenta", saldo.cuenta)
            gt("importe", 0.0)
            sqlRestriction "year(fecha) = ? and month(fecha) = ? ", [saldo.ejercicio, saldo.mes]
            projections {
                sum('importe')
            }
        }
        saldo.ingresos = res?: 0.0
    }

    @CompileDynamic
    void egresos(SaldoPorCuentaDeBanco saldo) {
        def c = MovimientoDeCuenta.createCriteria()
        def res = c.get {
            eq("cuenta", saldo.cuenta)
            lt("importe", 0.0)
            sqlRestriction "year(fecha) = ? and month(fecha) = ? ", [saldo.ejercicio, saldo.mes]
            projections {
                sum('importe')
            }
        }
        saldo.egresos = res?: 0.0

    }

    void correrSaldos(String id, Integer ejercicio = Periodo.currentYear()) {
        Integer mes = Periodo.currentMes()
        (1..mes).each { Integer it ->
            actualizarSaldo(id, ejercicio, it)
        }
    }
}
