package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser


@Slf4j
@GrailsCompileStatic
@Service(MovimientoDeTesoreria)
abstract  class MovimientoDeTesoreriaService implements  LogUser{

    abstract  MovimientoDeTesoreria save(MovimientoDeTesoreria movimiento)

    abstract void delete(Serializable id)

    MovimientoDeTesoreria registrar(MovimientoDeTesoreria movimiento) {
        // movimiento.movimiento = generarMovimiento(movimiento)
        logEntity(movimiento)
        return save(movimiento)
    }



    MovimientoDeCuenta generarMovimiento(MovimientoDeTesoreria m) {

        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.formaDePago = 'TRANSFERENCIA'
        egreso.tipo = 'TESORERIA'
        egreso.fecha = m.fecha
        egreso.concepto = m.concepto.toString()
        egreso.moneda = m.cuenta.moneda
        egreso.tipoDeCambio = 1.0
        egreso.importe = m.importe
        // Datos del pago
        egreso.referencia = m.referencia
        egreso.afavor = Empresa.first().nombre
        egreso.cuenta = m.cuenta
        egreso.conceptoReporte = m.concepto
        logEntity(egreso)
        return egreso

    }

}
