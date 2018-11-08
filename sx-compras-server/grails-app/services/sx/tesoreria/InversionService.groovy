package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Service(Inversion)
abstract  class InversionService implements  LogUser{

    abstract  Inversion save(Inversion Inversion)

    abstract void delete(Serializable id)

    Inversion registrar(Inversion inversion) {
        inversion.moneda = inversion.cuentaOrigen.moneda
        registrarSalida(inversion)
        registrarEntrada(inversion)
        logEntity(inversion)
        return save(inversion)
    }

    void registrarSalida(Inversion inversion) {
        MovimientoDeCuenta egreso = generarMovimiento(
                inversion.fecha,
                inversion.importe * -1, 'INVERSION', 'EGRESO',
                inversion.cuentaOrigen, inversion.referencia )
        logEntity(egreso)
        inversion.addToMovimientos(egreso)
    }

    void registrarEntrada(Inversion inversion) {
        MovimientoDeCuenta ingreso = generarMovimiento(
                inversion.fecha,
                inversion.importe, 'INVERSION', 'INGRESO',
                inversion.cuentaDestino,
                inversion.referencia)
        logEntity(ingreso)
        inversion.addToMovimientos(ingreso)
    }


    Inversion actualizar(Inversion inversion){
        logEntity(inversion)
        return save(inversion)
    }


    MovimientoDeCuenta generarMovimiento(Date fecha, BigDecimal importe, String tipo, String concepto, CuentaDeBanco cuenta, String referencia) {

        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = tipo
        egreso.fecha = fecha
        egreso.concepto = concepto
        egreso.moneda = cuenta.moneda
        egreso.tipoDeCambio = 1.0
        egreso.importe = importe
        egreso.comentario = 'INVERSION'
        egreso.formaDePago = 'TRANSFERENCIA'
        // Datos del pago
        egreso.referencia = referencia
        egreso.afavor = Empresa.first().nombre
        egreso.cuenta = cuenta
        logEntity(egreso)
        return egreso

    }
}
