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

        CuentaPorCobrar cxc = generarCuentaPorCobrar(che)
        logEntity(cxc)
        cxc.save flush: true

        MovimientoDeCuenta egreso = generarEgreso(che)
        logEntity(egreso)
        egreso.save flush: true

        che.cxc = cxc
        che.folio = cxc.documento
        che.nombre = cxc.cliente.nombre
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

        if(chequeDevuelto.egreso) return
        assert chequeDevuelto.cheque.ficha, "Se requiere la ficha de deposito para el Cobro: ${chequeDevuelto.cheque.cobro.id}"
        Empresa empresa = Empresa.first()
        MovimientoDeCuenta mov = new MovimientoDeCuenta()
        mov.referencia = "${chequeDevuelto.cheque.numero} "
        mov.tipo = 'CHE';
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


}
