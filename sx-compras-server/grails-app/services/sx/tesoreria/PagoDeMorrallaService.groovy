
package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser
import sx.utils.MonedaUtils

@Slf4j
@GrailsCompileStatic
@Service(PagoDeMorralla)
abstract class PagoDeMorrallaService implements  LogUser{

    abstract  PagoDeMorralla save(PagoDeMorralla comision)

    abstract void delete(Serializable id)

    PagoDeMorralla registrar(PagoDeMorralla pagoDeMorralla) {
        logEntity(pagoDeMorralla)
        generarIngresos(pagoDeMorralla)
        generarEgreso(pagoDeMorralla)
        return save(pagoDeMorralla)
    }

    def generarIngresos(PagoDeMorralla pago){
        pago.partidas.each { Morralla m ->
            MovimientoDeCuenta ingreso = new MovimientoDeCuenta()
            ingreso.cuenta = pago.cuentaIngreso
            ingreso.fecha = m.fecha
            ingreso.tipo = 'MORRALLA'
            ingreso.concepto = 'ABONO_MORRALLA'
            ingreso.moneda = MonedaUtils.PESOS
            ingreso.tipoDeCambio = 1.0
            ingreso.importe = m.importe.abs()
            ingreso.comentario = m.comentario
            ingreso.formaDePago = pago.formaDePago
            ingreso.referencia = pago.referencia
            ingreso.afavor = pago.proveedor.nombre
            pago.addToMovimientos(ingreso)
            logEntity(ingreso)

        }
    }



    MovimientoDeCuenta generarEgreso( PagoDeMorralla pago) {
        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.cuenta = pago.cuentaEgreso
        egreso.fecha = pago.fecha
        egreso.tipo = 'MORRALLA'
        egreso.concepto = 'CARGO_MORRALLA'
        egreso.moneda =  MonedaUtils.PESOS
        egreso.tipoDeCambio = 1.0
        egreso.importe = pago.importe.abs() * -1
        egreso.comentario = pago.comentario
        egreso.formaDePago = pago.formaDePago
        egreso.referencia = pago.referencia
        egreso.afavor = Empresa.first().nombre
        pago.egreso = egreso
        logEntity(egreso)
        return egreso
    }


}
