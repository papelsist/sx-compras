package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser
import sx.cxc.Cobro
import sx.cxc.CobroDeposito
import sx.cxc.CobroTransferencia
import sx.cxp.Rembolso
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
        egreso.fecha = requisicion.fechaDePago
        egreso.concepto = concepto
        egreso.moneda = cuenta.moneda
        egreso.tipoDeCambio = requisicion.tipoDeCambio

        if(cuenta.moneda != requisicion.moneda) {
            egreso.importe = (requisicion.apagar * -1) * requisicion.tipoDeCambio
        } else {
            egreso.importe = requisicion.apagar * -1
        }

        egreso.comentario = requisicion.comentario
        egreso.formaDePago = requisicion.formaDePago

        // Datos del pago
        egreso.referencia = referencia
        egreso.afavor = requisicion.nombre
        egreso.conceptoReporte = egreso.afavor
        egreso.cuenta = cuenta
        logEntity(egreso)

        if(egreso.formaDePago == 'CHEQUE') {
            generarCheque(egreso)

        }
        return egreso

    }

    def generarCheque(MovimientoDeCuenta egreso) {
        log.info('Generando cheque para egreso: {} Para: {}', egreso.importe, egreso.afavor)
        if(egreso.formaDePago == 'CHEQUE' ) {
            if(egreso.cheque != null)
                throw new RuntimeException("Egreso ${egreso.id}  con  cheque ${egreso.cheque.folio}  ya generado")
            CuentaDeBanco cuenta = egreso.cuenta

            Cheque cheque = new Cheque()
            cheque.cuenta = egreso.cuenta
            cheque.nombre = egreso.afavor
            cheque.fecha = egreso.fecha

            cheque.importe = egreso.importe.abs()
            if(!egreso.referencia) {
                if(!cuenta.proximoCheque)
                    cuenta.proximoCheque = 0L
                cheque.folio = cuenta.proximoCheque
                cuenta.proximoCheque = cuenta.proximoCheque + 1
                cuenta.save()
                egreso.referencia = cheque.folio.toString()
            } else {
                cheque.folio = egreso.referencia.toLong()
            }
            cheque.egreso = egreso
            egreso.cheque = cheque
            logEntity(cheque)

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
            comision.conceptoReporte = 'COMISION_POR_TRANSFERENCIA'
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

    MovimientoDeCuenta generarEgreso(Rembolso rembolso, CuentaDeBanco cuenta, String referencia) {

        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = 'REMBOLSO'
        egreso.concepto = rembolso.concepto
        egreso.sucursal = egreso.sucursal
        egreso.fecha = rembolso.fechaDePago
        egreso.moneda = cuenta.moneda
        egreso.tipoDeCambio = rembolso.tipoDeCambio
        egreso.importe = rembolso.apagar * -1
        egreso.comentario = rembolso.comentario
        egreso.formaDePago = rembolso.formaDePago

        // Datos del pago
        egreso.referencia = referencia
        egreso.afavor = rembolso.nombre
        egreso.conceptoReporte = egreso.afavor
        egreso.cuenta = cuenta
        logEntity(egreso)
        if(egreso.formaDePago == 'CHEQUE'){
            generarCheque(egreso)
            egreso.referencia = egreso.cheque.folio.toString()
        }
        return egreso

    }

    /**
     * Temporal debe ir en CobroServies
     *
     * @param deposito
     * @return
     */
    MovimientoDeCuenta generarIngresoPorDepositoBancario(CobroDeposito deposito) {
        Cobro cobro = deposito.cobro
        String sucursal = cobro.sucursal.nombre
        MovimientoDeCuenta mov = new MovimientoDeCuenta()
        mov.sucursal = sucursal
        mov.referencia = "Deposito: ${deposito.folio} "
        mov.tipo = cobro.tipo
        if(['CRE','JUR','CHE'].contains(mov.tipo)) {
            mov.fecha = cobro.fecha
        } else {
            if(cobro.primeraAplicacion == null)
                return null
            mov.fecha = cobro.primeraAplicacion
        }
        mov.formaDePago = cobro.formaDePago
        mov.comentario = "Deposito ${cobro.tipo} ${cobro.sucursal.nombre} "
        mov.conceptoReporte = "Deposito suc: ${sucursal}"
        mov.cuenta = deposito.cuentaDestino
        mov.afavor = Empresa.first().nombre
        mov.importe = cobro.importe
        mov.moneda = deposito.cuentaDestino.moneda
        mov.concepto = 'VENTAS'
        mov.save failOnError: true, flush: true
        deposito.ingreso = mov
        cobro.save flush: true
        return mov
    }

    /**
     * Temporal debe ir en CobroServies
     *
     * @param deposito
     * @return
     */
    MovimientoDeCuenta generarIngresoPorTransferencia(CobroTransferencia deposito) {
        Cobro cobro = deposito.cobro
        String sucursal = cobro.sucursal.nombre
        MovimientoDeCuenta mov = new MovimientoDeCuenta()
        mov.sucursal = sucursal
        mov.referencia = "Deposito: ${deposito.folio} "
        mov.tipo = cobro.tipo
        if(['CRE','JUR','CHE'].contains(mov.tipo)) {
            mov.fecha = cobro.fecha
        } else {
            if(cobro.primeraAplicacion == null)
                return null
            mov.fecha = cobro.primeraAplicacion
        }
        mov.formaDePago = cobro.formaDePago
        mov.comentario = "Deposito ${cobro.tipo} ${cobro.sucursal.nombre} "
        mov.conceptoReporte = "Deposito suc: ${sucursal}"
        mov.cuenta = deposito.cuentaDestino
        mov.afavor = Empresa.first().nombre
        mov.importe = cobro.importe
        mov.moneda = deposito.cuentaDestino.moneda
        mov.concepto = 'VENTAS'

        mov.save failOnError: true, flush: true
        deposito.ingreso = mov
        cobro.save flush: true
        return mov
    }
}



