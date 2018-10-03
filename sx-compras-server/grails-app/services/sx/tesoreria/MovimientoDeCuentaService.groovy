package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import sx.core.LogUser
import sx.cxp.RequisicionDeGastos

@Transactional
@GrailsCompileStatic
@Slf4j
class MovimientoDeCuentaService implements  LogUser{



    MovimientoDeCuenta generarPagoDeGastos(RequisicionDeGastos requisicionDeGastos, CuentaDeBanco cuenta, String referencia) {
        if(!requisicionDeGastos.egreso) {
            MovimientoDeCuenta egreso = new MovimientoDeCuenta()
            egreso.tipo = 'GASTO'
            egreso.importe = requisicionDeGastos.apagar * -1
            egreso.fecha = requisicionDeGastos.fechaDePago
            egreso.concepto = 'GASTOS'
            egreso.moneda = Currency.getInstance(requisicionDeGastos.moneda)
            egreso.tipoDeCambio = requisicionDeGastos.tipoDeCambio
            egreso.comentario = requisicionDeGastos.comentario
            egreso.formaDePago = requisicionDeGastos.formaDePago

            // Datos del pago
            egreso.referencia = referencia
            egreso.afavor = requisicionDeGastos.nombre
            egreso.cuenta = cuenta
            egreso.save flush: true
            requisicionDeGastos.egreso = egreso
            requisicionDeGastos.pagada = egreso.fecha
            logEntity(egreso)
            requisicionDeGastos.save()
            log.info("Egreso generado ${egreso.id}")
            return egreso
        }
    }
}


