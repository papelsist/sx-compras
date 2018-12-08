package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Service(Traspaso)
abstract class TraspasoService implements  LogUser{

    abstract  Traspaso save(Traspaso traspaso)

    abstract void delete(Serializable id)

    Traspaso registrar(Traspaso traspaso) {
        traspaso.moneda = traspaso.cuentaOrigen.moneda
        registrarSalida(traspaso)
        registrarComision(traspaso)
        registrarEntrada(traspaso)
        logEntity(traspaso)
        return save(traspaso)
    }

    void registrarSalida(Traspaso traspaso) {
        MovimientoDeCuenta egreso = generarMovimiento(
                traspaso.fecha,
                traspaso.importe * -1, 'TRASPASO', 'RETIRO',
                traspaso.cuentaOrigen, traspaso.referencia )
        egreso.conceptoReporte = "TRASPASO A ${traspaso.cuentaDestino.bancoSat.nombreCorto} ${traspaso.cuentaDestino.numero}"
        logEntity(egreso)
        traspaso.addToMovimientos(egreso)
    }

    void registrarEntrada(Traspaso traspaso) {
        MovimientoDeCuenta ingreso = generarMovimiento(
                traspaso.fecha,
                traspaso.importe, 'TRASPASO', 'DEPOSITO',
                traspaso.cuentaDestino,
                traspaso.referencia)
        ingreso.conceptoReporte = "TRASPASO DE ${traspaso.cuentaOrigen.bancoSat.nombreCorto} ${traspaso.cuentaOrigen.numero}"
        logEntity(ingreso)
        traspaso.addToMovimientos(ingreso)
    }

    void registrarComision(Traspaso traspaso) {
        if(traspaso.comision) {
            MovimientoDeCuenta comision = generarMovimiento(
                    traspaso.fecha,
                    traspaso.comision * -1, 'TRASPASO', 'COMISION',
                    traspaso.cuentaOrigen,
                    traspaso.referencia)
            comision.conceptoReporte = "COMISION DE TRASPASO"
            traspaso.addToMovimientos(comision)
            logEntity(comision)
            if(traspaso.impuesto) {
                MovimientoDeCuenta iva = generarMovimiento(
                        traspaso.fecha,
                        traspaso.impuesto * -1, 'TRASPASO', 'IVA',
                        traspaso.cuentaOrigen,
                        traspaso.referencia )
                iva.conceptoReporte = "IVA COMISION DE TRASPASO"
                logEntity(iva)
                traspaso.addToMovimientos(iva)
            }
        }
    }

    Traspaso actualizar(Traspaso traspaso){
        logEntity(traspaso)
        return save(traspaso)
    }


    MovimientoDeCuenta generarMovimiento(Date fecha, BigDecimal importe, String tipo, String concepto, CuentaDeBanco cuenta, String referencia) {

        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = tipo
        egreso.fecha = fecha
        egreso.concepto = concepto
        egreso.moneda = cuenta.moneda
        egreso.tipoDeCambio = 1.0
        egreso.importe = importe
        egreso.comentario = 'TRASPASO ENTRE CUENTAS'
        egreso.formaDePago = 'TRANSFERENCIA'
        // Datos del pago
        egreso.referencia = referencia
        egreso.afavor = Empresa.first().nombre
        egreso.cuenta = cuenta
        logEntity(egreso)
        return egreso

    }
}
