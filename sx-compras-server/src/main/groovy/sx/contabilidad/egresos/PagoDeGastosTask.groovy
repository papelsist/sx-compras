package sx.contabilidad.egresos

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Proveedor
import sx.cxp.CuentaPorPagar
import sx.cxp.Requisicion
import sx.cxp.RequisicionDet
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

        registrarRetenciones(poliza, r)

        abonoBanco(poliza, r)
        ajustarProveedorBanco(poliza)

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
        List<RequisicionDet> partidas = r.partidas.sort {it.cxp.folio}
        partidas.each {
            CuentaPorPagar cxp = it.cxp
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                    " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"
            Map row = [
                    asiento: "PAGO_${egreso.tipo}",
                    referencia: r.proveedor.nombre,
                    referencia2: r.proveedor.nombre,
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

            if(co.tipo == 'COMPRAS') {
                cv = "201-0002-${co.cuentaOperativa}-0000"
            }
            if(co.tipo == 'RELACIONADAS') {
                cv = "205-0009-${co.cuentaOperativa}-0000"
            }
            if(co.tipo == 'RELACIONADAS' && (co.cuentaOperativa == '0038' || co.cuentaOperativa == '0061')) {
                cv = "201-0001-${co.cuentaOperativa}-0000"
            }
            if(co.tipo == 'FLETES') {
                cv = "205-0004-${co.cuentaOperativa}-0000"
            }
            if(co.tipo == 'SEGUROS') {
                cv = "205-0003-${co.cuentaOperativa}-0000"
            }


            if(['0038','0061'].contains(co.cuentaOperativa)) {
                cv = "201-0001-${co.cuentaOperativa}-0000"
            }

            BigDecimal total = MonedaUtils.round(it.apagar  * r.tipoDeCambio)

            if(['0331','0380'].contains(co.cuentaOperativa)) {
                total = it.cxp.total
            }

            poliza.addToPartidas(mapRow(cv, desc, row, total))


            BigDecimal ivaCfdi = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva
            poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaCfdi))
            poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, ivaCfdi))
        }

    }

    void abonoBanco(Poliza poliza, Requisicion r) {
        MovimientoDeCuenta egreso = r.egreso

        // Abono a Banco

        def prebanco= '102'

        if(egreso.cuenta.tipo == 'INVERSION'){
            prebanco = '103'
        }

        String ctaBanco = "${prebanco}-${egreso.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${egreso.cuenta.subCuentaOperativa}-0000"
        // log.info('Cta de banco: {}, {} MXN: {}', ctaBanco, egreso.moneda, egreso.moneda == 'MXN')
        Map row = [
                asiento: "PAGO_${egreso.tipo}",
                referencia: r.nombre,
                referencia2:r.proveedor.nombre,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS'
        ]
        buildComplementoDePago(row, egreso)
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
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
                referencia2: r.proveedor.nombre,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS'
        ]
        buildComplementoDePago(row, egreso)
        String desc2 = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "

        r.partidas.each {
            if(it.cxp.impuestoRetenido > 0) {

                CuentaPorPagar cxp = it.cxp
                String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                        " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                        " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"
                if(cxp.impuestoRetenidoIva > 0.0) {
                    BigDecimal imp = cxp.impuestoRetenidoIva
                    poliza.addToPartidas(mapRow('118-0003-0000-0000', desc, row, imp))
                    poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, 0.0, imp))

                    poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, imp))
                    poliza.addToPartidas(mapRow('213-0011-0000-0000', desc, row, 0.0, imp))
                }
                if(cxp.impuestoRetenidoIsr > 0.0) {
                    BigDecimal imp = cxp.impuestoRetenidoIsr
                    poliza.addToPartidas(mapRow('216-0002-0000-0000', desc, row, imp))
                    poliza.addToPartidas(mapRow('213-0010-0000-0000', desc, row, 0.0, imp))
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
        poliza.concepto = "${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'}  ${r.egreso.referencia} ${r.egreso.afavor} (${r.egreso.fecha.format('dd/MM/yyyy')}) (${r.egreso.tipo})"
        if(r.moneda != 'MXN') {
            poliza.concepto = poliza.concepto + "TC: ${r.egreso.tipoDeCambio}"
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

    @CompileDynamic
    void ajustarProveedorBanco(Poliza poliza) {
        PolizaDet abonoBanco = poliza.partidas.find {it.cuenta.clave.startsWith('102')}

        if(poliza.partidas.find {it.cuenta.clave.startsWith('103')}){
            abonoBanco = poliza.partidas.find {it.cuenta.clave.startsWith('103')}
        }       
         
        List<PolizaDet> provs = poliza.partidas.findAll{ it.cuenta.clave.startsWith('201') || it.cuenta.clave.startsWith('205')}
        def debe = provs.sum 0.0, {it.debe}

        def dif = abonoBanco.haber - debe
        // log.info('Debe: {}', debe)
        //  log.info('Cuadre especial por: {}', dif)

        if(dif.abs() > 0.0 &&  dif.abs() <= 5.0){

            def det = abonoBanco

            if(dif < 0.0) {

                PolizaDet pdet = new PolizaDet()
                pdet.cuenta = buscarCuenta('704-0005-0000-0000')
                pdet.concepto = pdet.cuenta.descripcion
                pdet.sucursal = det.sucursal
                pdet.origen = det.origen
                pdet.referencia = det.referencia
                pdet.referencia2 = det.referencia2
                pdet.haber = dif.abs()
                pdet.descripcion = det.descripcion
                pdet.entidad = det.entidad
                pdet.asiento = det.asiento+ '_OPRD'
                pdet.documentoTipo = det.documentoTipo
                pdet.documentoFecha = det.documentoFecha
                pdet.documento = det.documento

                poliza.addToPartidas(pdet)

            } else {
                PolizaDet pdet = new PolizaDet()
                pdet.cuenta = buscarCuenta('703-0001-0000-0000')
                pdet.concepto = pdet.cuenta.descripcion
                pdet.sucursal = det.sucursal
                pdet.origen = det.origen
                pdet.referencia = det.referencia
                pdet.referencia2 = det.referencia2
                pdet.debe = dif.abs()
                pdet.descripcion = det.descripcion
                pdet.entidad = det.entidad
                pdet.asiento = det.asiento+ '_OGST'
                pdet.documentoTipo = det.documentoTipo
                pdet.documentoFecha = det.documentoFecha
                pdet.documento = det.documento
                poliza.addToPartidas(pdet)
            }
        }


    }

}
