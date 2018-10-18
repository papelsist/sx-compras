package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import groovy.util.logging.Slf4j

import sx.core.LogUser
import sx.cxp.Requisicion
import sx.cxp.RequisicionDeCompras
import sx.cxp.RequisicionDeGastos
import sx.utils.MonedaUtils

@Transactional
@GrailsCompileStatic
@Slf4j
class MovimientoDeCuentaService implements  LogUser{



    MovimientoDeCuenta generarEgreso(Requisicion requisicion,String tipo, String concepto, CuentaDeBanco cuenta, String referencia) {

        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = tipo
        egreso.importe = requisicion.apagar * -1
        egreso.fecha = requisicion.fechaDePago
        egreso.concepto = concepto
        egreso.moneda = Currency.getInstance(requisicion.moneda)
        egreso.tipoDeCambio = requisicion.tipoDeCambio
        egreso.comentario = requisicion.comentario
        egreso.formaDePago = requisicion.formaDePago

        // Datos del pago
        egreso.referencia = referencia
        egreso.afavor = requisicion.nombre
        egreso.cuenta = cuenta
        logEntity(egreso)

        if(egreso.formaDePago == 'CHEQUE') {
            generarCheque(egreso)
            egreso.referencia = egreso.cheque.folio.toString()
        }
        return egreso

    }

    def generarCheque(MovimientoDeCuenta egreso) {
        if(egreso.formaDePago == 'CHEQUE' ) {
            if(egreso.cheque != null)
                throw new RuntimeException("Egreso ${egreso.id}  con  cheque ${egreso.cheque.folio}  ya generado")
            CuentaDeBanco cuenta = egreso.cuenta

            Cheque cheque = new Cheque()
            cheque.cuenta = egreso.cuenta
            cheque.nombre = egreso.afavor
            cheque.fecha = egreso.fecha
            cheque.folio = cuenta.proximoCheque
            cheque.importe = egreso.importe.abs()
            cuenta.proximoCheque = cuenta.proximoCheque + 1

            cheque.egreso = egreso
            egreso.cheque = cheque
            logEntity(cheque)

            cuenta.save()
        }
    }

    MovimientoDeCuenta generarComisionPorTransferencia(Requisicion requisicion) {
        if(requisicion.egreso.cuenta.comisionPorTransferencia > 0) {
            BigDecimal importe = MonedaUtils.calcularTotal(requisicion.egreso.cuenta.comisionPorTransferencia)
            MovimientoDeCuenta comision = new MovimientoDeCuenta()
            comision.tipo = requisicion.egreso.tipo
            comision.importe = importe * -1
            comision.fecha = requisicion.fechaDePago
            comision.concepto = 'COMISION_POR_TRANSFERENCIA'
            comision.moneda = Currency.getInstance(requisicion.moneda)
            comision.tipoDeCambio = requisicion.tipoDeCambio
            comision.comentario = requisicion.comentario
            comision.formaDePago = requisicion.formaDePago

            // Datos del pago
            comision.referencia = requisicion.egreso.id
            comision.afavor = requisicion.nombre
            comision.cuenta = requisicion.egreso.cuenta
            logEntity(comision)
            return comision
            //comision.save flush: true
        } else {
            return null
        }
    }
}



