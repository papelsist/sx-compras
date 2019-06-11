package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import sx.core.Cliente
import sx.core.Empresa
import sx.core.FolioLog
import sx.core.LogUser
import sx.core.Sucursal

import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils


@GrailsCompileStatic
@Transactional
class ChequeDevueltoService implements  LogUser, FolioLog{

    NotaDeCargoService notaDeCargoService

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
        cxc.formaDePago = 'POR DEFINIR'
        cxc.documento = nextFolio('CHEQUE_DEVUELTO', cxc.tipo)
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
        mov.sucursal = chequeDevuelto.cxc.sucursal.nombre
        mov.conceptoReporte = "Cargo por cheque devuelto suc: ${chequeDevuelto.cxc.sucursal.nombre}"
        mov.cuenta = chequeDevuelto.cheque.ficha.cuentaDeBanco
        mov.afavor = empresa.nombre
        mov.importe = chequeDevuelto.cxc.total * -1
        mov.moneda = mov.cuenta.moneda
        mov.concepto = 'CHEQUE_DEVUELTO'
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


    @Transactional
    ChequeDevuelto generarNotaDeCargo(ChequeDevuelto che) {

        def importe = MonedaUtils.calcularImporteDelTotal(che.importe)
        def impuesto = MonedaUtils.calcularImpuesto(importe)
        def total = importe + impuesto

        if( (importe as BigDecimal) <= 0.0)
            return null

        NotaDeCargo nc = new NotaDeCargo()
        nc.tipo = 'CHE'
        nc.formaDePago = 'COMPENSACION'
        nc.cliente = che.cxc.cliente
        nc.sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        nc.fecha = new Date()
        nc.comentario = "CARGO POR CHEQUE DEVUELTO "
        nc.importe = importe as BigDecimal
        nc.impuesto = impuesto
        nc.total = total
        nc.tipoDeCalculo = 'NINGUNO'
        nc.serie = 'CHE'
        nc.folio = nextFolio('NOTA_DE_CARGO', nc.serie)
        nc.usoDeCfdi = 'G03'
        nc.cuentaPorCobrar = notaDeCargoService.generarCuentaPorCobrar(nc)

        NotaDeCargoDet det = new NotaDeCargoDet()
        det.comentario = nc.comentario
        det.concepto = '84101700'
        det.importe = nc.importe
        det.impuesto = nc.impuesto
        det.total = nc.total

        det.documento = 0L
        det.documentoTipo = 'ND'
        det.documentoSaldo = 0.0
        det.documentoTotal = 0.0
        det.documentoFecha = nc.fecha
        det.sucursal = nc.sucursal.nombre

        nc.addToPartidas(det)
        logEntity(nc)
        logEntity(nc.cuentaPorCobrar)

        /** TEMPO **/
        nc.createUser = 'admin'
        nc.updateUser = 'admin'
        nc.cuentaPorCobrar.createUser = 'admin'
        nc.cuentaPorCobrar.updateUser = 'admin'
        /** END TEMPO **/

        nc = nc.save failOnError: true, flush: true
        notaDeCargoService.generarCfdi(nc)
        notaDeCargoService.timbrar(nc)
        che.notaDeCargo = nc
        che.save flush: true
        return che
    }


}
