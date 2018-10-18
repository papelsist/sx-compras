package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.Proveedor
import sx.utils.Periodo


@GrailsCompileStatic
@Slf4j
@Service(ProveedorSaldo)
abstract class ProveedorSaldoService {

    abstract ProveedorSaldo save(ProveedorSaldo proveedorSaldo)

    ProveedorSaldo actualizarSaldo(String proveedorId, Integer ejercicio = Periodo.currentYear(), Integer mes = Periodo.currentMes()) {
        ProveedorSaldo saldo = find(Proveedor.get(proveedorId), ejercicio, mes)
        saldoInicial(saldo)
        cargos(saldo)
        abonos(saldo)
        saldo.saldoFinal = saldo.saldoInicial + saldo.cargos - saldo.abonos
        saldo = save(saldo)
        log.info('Saldo del proveedor {} actualizado Saldo: {}',proveedorId, saldo)
        return saldo
    }


    ProveedorSaldo find(Proveedor proveedor, Integer ejercicio, Integer mes) {
        return ProveedorSaldo.findOrCreateWhere(proveedor: proveedor, ejercicio: ejercicio, mes: mes)
    }

    void saldoInicial(ProveedorSaldo saldo) {
        Integer ejercicio = saldo.ejercicio
        Integer mes = saldo.mes - 1
        if(mes <= 0) {
            ejercicio = ejercicio - 1
            mes = 1
        }
        ProveedorSaldo anterior = find(saldo.proveedor, ejercicio, mes)
        saldo.saldoInicial = anterior ? anterior.saldoFinal : 0.0
    }

    @CompileDynamic
    void  cargos(ProveedorSaldo saldo) {
        def c = Pago.createCriteria()
        def res = c.get {
            eq("proveedor", saldo.proveedor)
            sqlRestriction "year(fecha) = ? and month(fecha) = ? ", [saldo.ejercicio, saldo.mes]
            projections {
                sum('total')
            }
        }
        saldo.abonos = res?: 0.0
    }

    @CompileDynamic
    void abonos(ProveedorSaldo saldo) {
        def c = CuentaPorPagar.createCriteria()
        def res = c.get {
            eq("proveedor", saldo.proveedor)
            sqlRestriction "year(fecha) = ? and month(fecha) = ? ", [saldo.ejercicio, saldo.mes]
            projections {
                sum('total')
            }
        }
        saldo.cargos = res?: 0.0

    }

    void correrSaldos(String proveedorId, Integer ejercicio = Periodo.currentYear()) {
        Integer mes = Periodo.currentMes()
        (1..mes).each { Integer it ->
            actualizarSaldo(proveedorId, ejercicio, it)
        }
    }
}
