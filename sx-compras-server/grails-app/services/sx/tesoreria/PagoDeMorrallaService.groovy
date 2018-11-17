
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
        egresos(pagoDeMorralla)
        ingreso(pagoDeMorralla)
        return save(pagoDeMorralla)
    }

    def egresos(PagoDeMorralla pago){
        pago.partidas.each { Morralla m ->
            MovimientoDeCuenta egreso = new MovimientoDeCuenta()
            egreso.cuenta = pago.cuentaEgreso
            egreso.fecha = pago.fecha
            egreso.tipo = 'MORRALLA'
            egreso.concepto = 'CARGO_MORRALLA'
            egreso.moneda = MonedaUtils.PESOS
            egreso.tipoDeCambio = 1.0
            egreso.importe = m.importe * -1
            egreso.comentario = m.comentario
            egreso.formaDePago = pago.formaDePago
            egreso.referencia = pago.referencia
            egreso.afavor = pago.proveedor.nombre
            logEntity(egreso)
            m.egreso = egreso

        }
    }



    MovimientoDeCuenta ingreso( PagoDeMorralla comision) {
        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.cuenta = comision.cuentaIngreso
        egreso.fecha = comision.fecha
        egreso.tipo = 'MORRALLA'
        egreso.concepto = 'ABONO_MORRALLA'
        egreso.moneda =  MonedaUtils.PESOS
        egreso.tipoDeCambio = 1.0
        egreso.importe = comision.importe
        egreso.comentario = comision.comentario
        egreso.formaDePago = comision.formaDePago
        egreso.referencia = comision.referencia
        egreso.afavor = Empresa.first().nombre
        logEntity(egreso)
        return egreso
    }


}
