package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.validation.Validateable
import groovy.util.logging.Slf4j
import sx.core.FolioLog
import sx.core.LogUser
import sx.cxp.Requisicion
import sx.cxp.RequisicionDeCompras
import sx.cxp.RequisicionDeGastos

@Transactional
@GrailsCompileStatic
@Slf4j
class MovimientoDeCuentaService implements  LogUser{



    MovimientoDeCuenta generarPagoDeGastos(RequisicionDeGastos requisicionDeGastos, CuentaDeBanco cuenta, String referencia) {
        return generarEgreso(requisicionDeGastos, 'GASTO', 'GASTOS', cuenta, referencia)

    }

    MovimientoDeCuenta generarPagoDeCompras(RequisicionDeCompras requisicionDeCompras, CuentaDeBanco cuenta, String referencia) {
        return generarEgreso(requisicionDeCompras, 'COMRA', 'COMPRAS', cuenta, referencia)
    }

    MovimientoDeCuenta generarEgreso(Requisicion requisicion,String tipo, String concepto, CuentaDeBanco cuenta, String referencia) {
        if(requisicion.egreso) {
            throw new RuntimeException("La ${requisicion.class.simpleName} ${requisicion.folio} ya ha sido pagada")
        }
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


        egreso.save flush: true
        if(egreso.formaDePago == 'CHEQUE') {
            generarCheque(egreso)
            egreso.referencia = egreso.cheque.folio.toString()
        }

        requisicion.egreso = egreso
        requisicion.pagada = egreso.fecha
        logEntity(egreso)
        requisicion.save()
        log.info("Egreso generado ${egreso.id}")
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

            logEntity(cuenta)
            logEntity(cheque)

            cuenta.save()
        }
    }
}

class PagoDeRequisicion implements Validateable {
    Requisicion requisicion
    CuentaDeBanco cuenta


    static constraints = {

    }
}


