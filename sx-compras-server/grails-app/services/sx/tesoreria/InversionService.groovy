package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser
import sx.utils.MonedaUtils

@Slf4j
@GrailsCompileStatic
@Service(Inversion)
abstract  class InversionService implements  LogUser{

    abstract  Inversion save(Inversion Inversion)

    abstract void delete(Serializable id)

    Inversion registrar(Inversion inversion) {
        inversion.moneda = inversion.cuentaOrigen.moneda
        if(!inversion.rendimientoFecha)
            inversion.rendimientoFecha = inversion.vencimiento

        // Retiro
        MovimientoDeCuenta egreso = generarMovimiento(
                inversion.fecha,
                inversion.importe * -1,
                'INVERSION',
                'RETIRO',
                inversion.cuentaOrigen,
                inversion.referencia )
        egreso.conceptoReporte = "INVERSION a: ${egreso.cuenta.numero} TASA: ${inversion.tasa}"
        logEntity(egreso)
        inversion.addToMovimientos(egreso)

        // Deposito
        MovimientoDeCuenta ingreso = generarMovimiento(
                inversion.fecha,
                inversion.importe,
                'INVERSION',
                'DEPOSITO',
                inversion.cuentaDestino,
                inversion.referencia)
        logEntity(ingreso)
        ingreso.conceptoReporte = "INVERSION de: ${ingreso.cuenta.numero} TASA: ${inversion.tasa}"
        inversion.addToMovimientos(ingreso)

        logEntity(inversion)
        return save(inversion)
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



    Inversion retorno(Inversion inversion) {

        if(!inversion.rendimientoFecha)
            inversion.rendimientoFecha = inversion.vencimiento

        // Retiro
        BigDecimal importe = inversion.importe  + inversion.rendimientoReal


        MovimientoDeCuenta retiro = generarMovimiento(
                inversion.rendimientoFecha,
                importe * -1,
                'RETORNO',
                'RETIRO',
                inversion.cuentaDestino,
                inversion.referencia )
        logEntity(retiro)
        retiro.conceptoReporte = "RETORNO INVERSION TASA: ${inversion.tasa}"
        inversion.addToMovimientos(retiro)

        MovimientoDeCuenta rendimiento = generarMovimiento(
                inversion.rendimientoFecha,
                inversion.rendimientoReal,
                'RETORNO',
                'RETIRO',
                inversion.cuentaDestino,
                inversion.referencia )
        rendimiento.conceptoReporte = "RENDIMIENTO DE INVERSION TASA: ${inversion.tasa}"
        logEntity(rendimiento)
        inversion.addToMovimientos(rendimiento)

        // Deposito
        MovimientoDeCuenta deposito = generarMovimiento(
                inversion.rendimientoFecha,
                importe,
                'RETORNO',
                'DEPOSITO',
                inversion.cuentaOrigen,
                inversion.referencia)
        deposito.conceptoReporte = "INVERSION DE ${inversion.cuentaOrigen.numero} TASA: ${inversion.tasa}"
        logEntity(deposito)
        inversion.addToMovimientos(deposito)
        inversion.retorno = new Date()
        logEntity(inversion)
        return save(inversion)

    }

    @CompileDynamic
    def recalcular(Inversion inversion) {

        def importe = inversion.importe,
            tasa = inversion.tasa,
            plazo = inversion.plazo,
            isr = inversion.isr
        Date fecha = inversion.fecha
        Date retorno = inversion.rendimientoFecha
        BigDecimal intereses = 0.0
        (fecha..retorno) {
            BigDecimal base = importe
            intereses = intereses + calcularIntereses(base, tasa, plazo, isr)
        }

        BigDecimal interesesIva = MonedaUtils.round(intereses * 0.16, 2)


    }

    BigDecimal calcularIntereses(BigDecimal importe, BigDecimal tasa, BigDecimal plazo, BigDecimal isr) {
        BigDecimal rendimientoDiario = (importe * (tasa / 100)) / 360
        BigDecimal rendimientoBruto = rendimientoDiario * plazo

        BigDecimal isrDiario = (importe * (isr / 100)) / 365
        BigDecimal isrImporte = MonedaUtils.round(isrDiario * plazo, 2)

        BigDecimal rendimientoNeto = rendimientoBruto - isrImporte
        BigDecimal redimientoCalculado = MonedaUtils.round(rendimientoNeto, 2)
        return redimientoCalculado

    }

    void cancelarInversion(Inversion inversion) {
        def movimientos = inversion.movimientos.collect{it.id}
        inversion.movimientos.clear()
        inversion.delete flush: true
        movimientos.each {
            MovimientoDeCuenta m = MovimientoDeCuenta.get(it)
            m.delete flush: true
        }
    }
}
