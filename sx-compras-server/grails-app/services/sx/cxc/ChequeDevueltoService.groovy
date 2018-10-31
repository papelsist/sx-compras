package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import sx.core.Empresa
import sx.core.Folio
import sx.core.LogUser
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils


@GrailsCompileStatic
@Transactional
class ChequeDevueltoService implements  LogUser{

    ChequeDevuelto save(ChequeDevuelto che) {

        che.importe = che.cheque.cobro.importe
        che.numero = che.cheque.numero.toString()
        che.comentario = "CHEQUE DEVUELTO EL ${che.fecha.format('dd/MM/yyyy')} "

        CuentaPorCobrar cxc = generarCuentaPorCobrar(che)
        logEntity(cxc)
        che.cxc = cxc
        che.folio = cxc.documento
        cxc.save flush: true

        MovimientoDeCuenta egreso = generarEgreso(che)
        logEntity(egreso)
        egreso.save flush: true



        che.egreso = egreso
        logEntity(che)
        return che.save(failOnError: true, flush: true)

    }

    CuentaPorCobrar generarCuentaPorCobrar(ChequeDevuelto chequeDevuelto){
        CobroCheque cobroCheque = chequeDevuelto.cheque

        CuentaPorCobrar cxc = new CuentaPorCobrar()
        cxc.cliente = cobroCheque.cobro.cliente
        cxc.sucursal = cobroCheque.cobro.sucursal
        cxc.formaDePago = cobroCheque.cobro.formaDePago
        cxc.documento = Folio.nextFolio('CHEQUE_DEVUELTO', cxc.tipo)
        cxc.comentario = 'Cargo por cheque devuelto'
        cxc.fecha = chequeDevuelto.fecha
        cxc.tipo = 'CHE'
        cxc.tipoDocumento = 'CHEQUE_DEVUELTO'
        cxc.importe = MonedaUtils.calcularImporteDelTotal(cobroCheque.cobro.importe)
        cxc.subtotal = cxc.importe
        cxc.impuesto = MonedaUtils.calcularImpuesto(cxc.importe)
        cxc.total = cobroCheque.cobro.importe
        return cxc
    }

    MovimientoDeCuenta generarEgreso(ChequeDevuelto chequeDevuelto) {

        if(chequeDevuelto.egreso)
            return
        if(chequeDevuelto.cheque.ficha == null)
            throw new RuntimeException("Cheque ${chequeDevuelto.cheque.numero} no tiene  ficha de deposito")

        Empresa empresa = Empresa.first()
        MovimientoDeCuenta mov = new MovimientoDeCuenta()
        mov.referencia = "${chequeDevuelto.cheque.numero} "
        mov.tipo = 'CHE'
        mov.fecha = chequeDevuelto.cxc.fecha
        mov.formaDePago = 'CHEQUE'
        mov.comentario = "CHEQUE DEVUELTO:  ${chequeDevuelto.cxc.sucursal.nombre} "
        mov.cuenta = chequeDevuelto.cheque.ficha.cuentaDeBanco
        mov.afavor = empresa.nombre
        mov.importe = chequeDevuelto.cxc.total * -1
        mov.moneda = mov.cuenta.moneda
        mov.concepto = 'CHEQUE_DEVUELTO'
        mov.sucursal = chequeDevuelto.cxc.sucursal.nombre
        return mov
    }

    void cancelar(ChequeDevuelto chequeDevuelto) {
        MovimientoDeCuenta egreso = chequeDevuelto.egreso
        CuentaPorCobrar cxc = chequeDevuelto.cxc
        chequeDevuelto.cxc = null
        chequeDevuelto.egreso = null

        chequeDevuelto.delete flush: true
        egreso.delete flush: true
        cxc.delete flush: true

    }


}
