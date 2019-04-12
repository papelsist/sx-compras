package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

import sx.core.FolioLog
import sx.core.LogUser
import sx.utils.MonedaUtils

@Slf4j
@Transactional
class NotaDeCargoService implements  LogUser, FolioLog{

    NotaDeCargo save(NotaDeCargo nota) {
        if(!nota.id){
            nota.folio = nextFolio('NOTA_DE_CARGO', nota.serie)
        }
        actualizarPartidas(nota)
        if (nota.tipoDeCalculo == 'PORCENTAJE') {
            calcularPorentaje(nota)
        } else {
            calcularProrrateo(nota)
        }
        if(nota.partidas) {
            nota.importe = nota.partidas.sum 0.0, {it.importe}
            nota.impuesto = nota.partidas.sum 0.0, {it.impuesto}
            nota.total = nota.partidas.sum 0.0, {it.total}
        } else {
            if(nota.total <= 0.0) {
                throw new RuntimeException('Nota de cargo sin conceptos debe tener el importe debe ser mayor a 0')
            }
            generarConceptoUnico(nota)
            nota.importe = nota.partidas.sum 0.0, {it.importe}
            nota.impuesto = nota.partidas.sum 0.0, {it.impuesto}
            nota.total = nota.partidas.sum 0.0, {it.total}
        }
        nota.cuentaPorCobrar = generarCuentaPorCobrar(nota)
        nota.save failOnError: true, flush:true
    }

    CuentaPorCobrar generarCuentaPorCobrar(NotaDeCargo nota) {
        CuentaPorCobrar cxc = new CuentaPorCobrar()
        cxc.sucursal = nota.sucursal
        cxc.cliente = nota.cliente
        cxc.tipoDocumento = 'NOTA_DE_CARGO'
        cxc.importe = nota.importe
        cxc.descuentoImporte = 0.0
        cxc.subtotal = nota.importe
        cxc.impuesto = nota.impuesto
        cxc.total  = nota.total
        cxc.formaDePago = nota.formaDePago
        cxc.moneda = nota.moneda
        cxc.tipoDeCambio = nota.tipoDeCambio
        cxc.comentario = nota.comentario
        cxc.tipo = nota.tipo
        cxc.documento = nota.folio
        cxc.fecha = new Date()
        cxc.comentario = nota.comentario
        logEntity(cxc)
        return cxc
    }

    private actualizarPartidas(NotaDeCargo nota){
        nota.partidas.each { NotaDeCargoDet det ->
            if (det.cuentaPorCobrar) {
                CuentaPorCobrar cxc = det.cuentaPorCobrar
                det.documento = cxc.documento
                det.documentoFecha = cxc.fecha
                det.documentoTipo= cxc.tipo
                det.documentoTotal = cxc.total
                det.documentoSaldo = cxc.saldo
                det.sucursal = cxc.sucursal.nombre
            }
            det.comentario = nota.comentario
        }
    }

    void calcularProrrateo(NotaDeCargo nota) {
        assert nota.total >0 , 'Nota de cargo requiere total para proceder Total registrado: ' + nota.total
        nota.cargo = 0.0;
        BigDecimal importe = nota.total

        List<CuentaPorCobrar> facturas = nota.partidas.collect{ it.cuentaPorCobrar}
        NotaDeCargoDet sinSaldo = nota.partidas.find{it.cuentaPorCobrar.getSaldo() == 0.0}
        log.debug('Se encontro una factura con saldo {}', sinSaldo)
        boolean sobreSaldo = sinSaldo == null

        BigDecimal base = facturas.sum 0.0,{ item -> sobreSaldo ? item.getSaldo() : item.getTotal()}

        log.debug("Importe a prorratear: ${importe} Base del prorrateo ${base} Tipo ${sobreSaldo ? 'SOBR SALDO': 'SOBRE TOTAL'}")

        nota.partidas.each {  det ->
            CuentaPorCobrar cxc = det.cuentaPorCobrar
            def monto = sobreSaldo ? cxc.getSaldo(): cxc.total
            def por = monto / base
            def asignado = MonedaUtils.round(importe * por)
            det.importe = MonedaUtils.calcularImporteDelTotal(asignado)
            det.impuesto = MonedaUtils.calcularImpuesto(det.importe)
            det.total = det.importe + det.impuesto
        }

    }

    def calcularPorentaje(NotaDeCargo nota) {
        log.debug('Generando Nota de cargo por el {}%', nota.cargo)
        def cargo = nota.cargo / 100
        boolean sobreSaldo = true
        nota.partidas.each {  NotaDeCargoDet det ->
            CuentaPorCobrar cxc = det.cuentaPorCobrar
            def monto = sobreSaldo ? det.cuentaPorCobrar.getSaldo() : det.cuentaPorCobrar.getTotal()
            def total = MonedaUtils.round(monto * cargo)
            det.total = total
            det.importe = MonedaUtils.calcularImporteDelTotal(total)
            det.impuesto = MonedaUtils.calcularImpuesto(det.importe)
        }
        return nota
    }




    void actualizarConceptoUnico(NotaDeCargo nota) {
        if(nota.partidas && nota.tipo == 'CHE') {
            NotaDeCargoDet det = nota.partidas[0]
            det.comentario = nota.comentario

            BigDecimal total = nota.total
            det.total = total
            det.importe = MonedaUtils.calcularImporteDelTotal(total)
            det.impuesto = MonedaUtils.calcularImpuesto(det.importe)
            det.total = det.importe + det.impuesto

            det.documento = nota.folio
            det.documentoTipo = nota.tipo
            det.documentoSaldo = nota.total
            det.documentoTotal = nota.total
            det.documentoFecha = nota.fecha
            det.sucursal = nota.sucursal.nombre
        }
    }

    def generarConceptoUnico(NotaDeCargo nota) {
        if(!nota.partidas) {
            log.info('Generando concepto unico para nora tipo {} N.Cargo ', nota.tipo)
            NotaDeCargoDet det = new NotaDeCargoDet()
            det.comentario = nota.comentario

            BigDecimal total = nota.total
            det.total = total
            det.importe = MonedaUtils.calcularImporteDelTotal(total)
            det.impuesto = MonedaUtils.calcularImpuesto(det.importe)
            det.total = det.importe + det.impuesto

            det.documento = nota.folio
            det.documentoTipo = nota.tipo
            det.documentoSaldo = 0.0
            det.documentoTotal = 0.0
            det.documentoFecha = nota.fecha
            det.sucursal = nota.sucursal.nombre
            nota.addToPartidas(det)
        }
    }
}
