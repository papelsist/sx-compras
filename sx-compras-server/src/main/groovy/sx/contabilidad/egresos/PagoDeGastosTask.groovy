package sx.contabilidad.egresos

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Proveedor
import sx.cxp.CuentaPorPagar
import sx.cxp.Requisicion

import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils

@Slf4j
@GrailsCompileStatic
@Component
class PagoDeGastosTask implements  AsientoBuilder, EgresoTask {

    /**
     * Genera los asientos requreidos por la poliza
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        Requisicion r = findRequisicion(poliza)

        log.info("Pago de GASTO: {}", r.egreso)

        ajustarConcepto(poliza, r)
        cargoProveedor(poliza, r)
        abonoBanco(poliza, r)
        registrarRetenciones(poliza, r)
        registrarDiferenciaCambiaria(poliza, r)
    }

    /**
     * Genera n cargos a proveedor, uno por cada factura mencionada en la requisicion
     *
     * @param poliza
     * @param r
     */
    void cargoProveedor(Poliza poliza, Requisicion r) {
        CuentaOperativaProveedor co = buscarCuentaOperativa(r.proveedor)
        log.info('Cuenta Operativa: {}', co)
        MovimientoDeCuenta egreso = r.egreso
        r.partidas.each {
            CuentaPorPagar cxp = it.cxp
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                    " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"
            Map row = [
                    asiento: "PAGO_${egreso.tipo}",
                    referencia: r.proveedor.nombre,
                    referencia2: egreso.cuenta.descripcion,
                    origen: egreso.id,
                    documento: cxp.folio,
                    documentoTipo: 'CXP',
                    documentoFecha: cxp.fecha,
                    sucursal: egreso.sucursal?: 'OFICINAS',
                    uuid: cxp.uuid,
                    rfc: cxp.proveedor.rfc,
                    montoTotal: cxp.total,
                    moneda: cxp.moneda,
                    tc: cxp.tipoDeCambio ? cxp.tipoDeCambio : 1.0
            ]
            buildComplementoDePago(row, egreso)
            // Cargo a Proveedor
            String cv = "205-0006-${co.cuentaOperativa}-0000"
            if(co.tipo != 'GASTOS') {
                cv = "201-0002-${co.cuentaOperativa}-0000"
            }
            if(['0038','0061'].contains(co.cuentaOperativa)) {
                cv = "201-0001-${co.cuentaOperativa}-0000"
            }

            poliza.addToPartidas(mapRow(cv, desc, row, MonedaUtils.round(it.apagar  * r.tipoDeCambio)))

            // IVA
            BigDecimal importe = MonedaUtils.calcularImporteDelTotal(it.apagar * r.tipoDeCambio)
            BigDecimal impuesto = it.apagar - importe
            poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, impuesto))
            poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, impuesto))
        }

    }

    void abonoBanco(Poliza poliza, Requisicion r) {
        MovimientoDeCuenta egreso = r.egreso

        // Abono a Banco
        String ctaBanco = "102-${egreso.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${egreso.cuenta.subCuentaOperativa}-0000"
        // log.info('Cta de banco: {}, {} MXN: {}', ctaBanco, egreso.moneda, egreso.moneda == 'MXN')
        Map row = [
                asiento: "PAGO_${egreso.tipo}",
                referencia: r.nombre,
                referencia2: egreso.cuenta.descripcion,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS'
        ]
        buildComplementoDePago(row, egreso)
        String desc = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "
        if(r.moneda != 'MXN') {
            desc = desc + " TC: ${r.tipoDeCambio}"
        }
        poliza.addToPartidas(mapRow(ctaBanco, desc, row, 0.0, egreso.importe.abs()))
    }

    void registrarRetenciones(Poliza poliza, Requisicion r) {
        MovimientoDeCuenta egreso = r.egreso
        Map row = [
                asiento: "PAGO_${egreso.tipo}",
                referencia: r.nombre,
                referencia2: egreso.cuenta.descripcion,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS'
        ]
        buildComplementoDePago(row, egreso)
        String desc = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "
        r.partidas.each {
            if(it.cxp.impuestoRetenido > 0) {
                CuentaPorPagar cxp = it.cxp
                if(cxp.impuestoRetenido > 0.0) {
                    BigDecimal imp = cxp.impuestoRetenido
                    poliza.addToPartidas(mapRow('118-0003-0000-0000', desc, row, imp))
                    poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, 0.0, imp))

                    poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, imp))
                    poliza.addToPartidas(mapRow('213-0011-0000-0000', desc, row, 0.0, imp))
                }

            }
        }
    }

    /**
     * Asientos requeridos para registrar la diferencia cambiaria
     *
     * @param poliza
     * @param r
     */
    void registrarDiferenciaCambiaria(Poliza poliza, Requisicion r) {
        if(r.moneda != 'MXN') {
            BigDecimal tcPago = r.tipoDeCambio
            r.partidas.each {
                CuentaPorPagar cxp = it.cxp
                BigDecimal apagar = it.apagar
                BigDecimal tc = cxp.tipoDeCambio
                BigDecimal apagarInicial = MonedaUtils.round(apagar * tc)
                BigDecimal apagarActualizado = MonedaUtils.round(apagar * tcPago)
                BigDecimal difCambiaria = apagarInicial - apagarActualizado

            }
        }
    }

    void ajustarConcepto(Poliza poliza, Requisicion r) {
        if(r.moneda != 'MXN') {
            poliza.concepto = poliza.concepto + "TC: ${r.tipoDeCambio}"
        }
    }

    Requisicion findRequisicion(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        Requisicion r = Requisicion.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Requisicion")
        return r
    }

    CuentaOperativaProveedor buscarCuentaOperativa(Proveedor p) {
        CuentaOperativaProveedor co = CuentaOperativaProveedor.where{proveedor == p}.find()
        if(!co) throw new RuntimeException("Proveedor ${p.nombre} sin cuenta operativa")
        return co
    }

    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'MovimientoDeCuenta',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs(),
        )
        // Datos del complemento
        if(row.uuid)
            asignarComprobanteNacional(det, row)
        if(row.metodoDePago)
            asignarComplementoDePago(det, row)
        return det
    }

}
