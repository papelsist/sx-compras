package sx.contabilidad.egresos

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import lx.econta.catalogo.Cuenta
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.CuentaOperativaProveedor
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.core.Proveedor
import sx.core.TipoDeCambio
import sx.cxp.AnalisisDeFactura
import sx.cxp.CuentaPorPagar
import sx.cxp.Requisicion
import sx.cxp.RequisicionDeCompras
import sx.cxp.RequisicionDet
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils
import sx.utils.Periodo

@Slf4j
@Component
class PagoDeCompraTask implements  AsientoBuilder, EgresoTask {



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

        log.info("Generando Asientos para poliza para egreso: {}", r.egreso)

        ajustarConcepto(poliza, r)
        cargoProveedor(poliza, r)

        registrarRetenciones(poliza, r)
        registrarDiferenciaCambiaria(poliza, r)
        abonoBanco(poliza, r)
        ajustarProveedorBanco(poliza)
        registrarVariacionCambiaria(poliza, r)
        registrarVariacionCambiariaIva(poliza, r)
        return poliza

    }

    /**
     * Genera n cargos a proveedor, uno por cada factura mencionada en la requisicion
     * 
     * @param poliza
     * @param r
     */
    @CompileDynamic
    void cargoProveedor(Poliza poliza, RequisicionDeCompras r) {
        log.info('Generando cargo al proveedor {}  Partidas de Req:{} = {}', r.nombre, r.folio, r.partidas.size())
        CuentaOperativaProveedor co = buscarCuentaOperativa(r.proveedor)
        MovimientoDeCuenta egreso = r.egreso

        List<RequisicionDet> partidas = r.partidas.sort { it.cxp.serie + it.cxp.folio}

        partidas.each {

            CuentaPorPagar cxp = it.cxp
            BigDecimal tipoDeCambio = cxp.tipoDeCambio

            if(r.moneda != 'MXN' && cxp.fecha.getMonth() != egreso.fecha.month) {

                Date nvaFecha = Periodo.inicioDeMes(egreso.fecha) - 2
                TipoDeCambio tc = TipoDeCambio.where{fecha == nvaFecha}.find()
                if(!tc) {
                    throw new RuntimeException("No existe Tipo de cambio para el ${nvaFecha}")
                }
                tipoDeCambio = tc.tipoDeCambio
            }

            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                    " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + tipoDeCambio : ''}"
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
                    tc: cxp.tipoDeCambio ? cxp.tipoDeCambio : 1.0,
                    ctaDestino: cxp.proveedor.cuentaBancaria,
                    bancoDestino: cxp.proveedor.banco
            ]
            buildComplementoDePago(row, egreso)
            // Cargo a Proveedor
            String cv = "201-0002-${co.cuentaOperativa}-0000"
            if(tipoDeCambio > 1.0) {
                cv = "201-0003-${co.cuentaOperativa}-0000"
            }
            if(['0038','0061'].contains(co.cuentaOperativa)) {
                cv = "201-0001-${co.cuentaOperativa}-0000"
            }
            poliza.addToPartidas(mapRow(cv, desc, row, MonedaUtils.round(it.apagar  * tipoDeCambio)))


            BigDecimal totalFactura = cxp.total
           // BigDecimal apagar = cxp.importePorPagar ?: 0.0
            BigDecimal apagar = it.apagar ?: 0.0  // a pagar requisicion
            BigDecimal dif = totalFactura - apagar // Diferencia para saber si existe DESCUENTO NORMAL
            // log.info('Fac {} Diferencia entre factura y requisicion: {}', cxp.folio, dif)
            // Impuesto trasladado
            BigDecimal impuestoTrasladado = cxp.impuestoTrasladado - (cxp.impuestoRetenido?:0.0)



            tipoDeCambio = egreso.tipoDeCambio
            if(r.moneda != egreso.moneda.currencyCode) {
                tipoDeCambio = r.tipoDeCambio
            }
            BigDecimal impuestoTrasladadoPara118 = MonedaUtils.round(impuestoTrasladado * tipoDeCambio)
            BigDecimal impuestoTrasladadoPara119 = MonedaUtils.round(impuestoTrasladado * cxp.tipoDeCambio)

             println "******"+totalFactura+" -- "+apagar+" -- "


            if( (dif.abs() * egreso.tipoDeCambio ) > (3.00 * egreso.tipoDeCambio) ) {
                // Reactivar para los casos de 10 dls de avery
                 // BigDecimal baseConIva = it.total + (cxp.impuestoRetenido?:0.0) 
                BigDecimal baseConIva = it.apagar + (cxp.impuestoRetenido?:0.0) // iva de lo pagado
                BigDecimal base = MonedaUtils.calcularImporteDelTotal(baseConIva)
                BigDecimal impuesto  = MonedaUtils.calcularImpuesto(base)
                log.info("Factura con descuento Folio:: ${cxp.folio} Pago: ${it.total} Base: {} Iva: {}", base, impuesto)
                impuestoTrasladado = impuesto - cxp.impuestoRetenido?:0.0

                // Reactivar para los casos de 10 dls de avery
                //impuestoTrasladadoPara118 = MonedaUtils.round(cxp.impuestoTrasladado * r.tipoDeCambio)

                impuestoTrasladadoPara118 = MonedaUtils.round(impuestoTrasladado * r.tipoDeCambio)
                impuestoTrasladadoPara119 = MonedaUtils.round(impuestoTrasladado * cxp.tipoDeCambio)

            } //else
            if (r.descuentof > 0.0) {

                log.info('Factura con descuento FINANCIERO')
                BigDecimal baseConIva = it.apagar + (cxp.impuestoRetenido?:0.0)
                BigDecimal base = MonedaUtils.calcularImporteDelTotal(baseConIva)
                BigDecimal impuesto  = MonedaUtils.calcularImpuesto(base)
                impuestoTrasladado = impuesto - cxp.impuestoRetenido?:0.0
                impuestoTrasladado = MonedaUtils.round(impuestoTrasladado * r.tipoDeCambio)

                impuestoTrasladadoPara118 = MonedaUtils.round(impuestoTrasladado * r.tipoDeCambio)
                impuestoTrasladadoPara119 = MonedaUtils.round(impuestoTrasladado * cxp.tipoDeCambio)

            }

            desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                    " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + tipoDeCambio : ''}"

            poliza.addToPartidas(mapRow('118-0001-0000-0000', desc, row, impuestoTrasladadoPara118))

            desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                    " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio : ''}"

            poliza.addToPartidas(mapRow('119-0001-0000-0000', desc, row, 0.0, impuestoTrasladadoPara119))
           
        }
        log.info('Prov: {} MON: {}', r.proveedor.clave, r.egreso.moneda)
        if(r.proveedor.clave == 'A001' && r.egreso.moneda == MonedaUtils.DOLARES) {
            r.partidas.each { det ->
                def cxp = det.cxp
                if(cxp) {
                    if(cxp.diferencia == 10.00) {
                        log.info('CASO AVERY  Dif:{}',cxp.diferencia)
                        Map row = [
                                asiento: "PAGO_${egreso.tipo}",
                                referencia: r.nombre,
                                referencia2: r.nombre,
                                origen: egreso.id,
                                documento: egreso.referencia,
                                documentoTipo: 'CXP',
                                documentoFecha: egreso.fecha,
                                sucursal: egreso.sucursal?: 'OFICINAS',
                                ctaDestino: r.proveedor.cuentaBancaria,
                                bancoDestino: r.proveedor.banco,
                        ]

                        BigDecimal importe = MonedaUtils.round(cxp.diferencia * egreso.tipoDeCambio)
                        buildComplementoDePago(row, egreso)

                        String cv = "201-0003-${co.cuentaOperativa}-0000"
                        BigDecimal tipoDeCambio = cxp.tipoDeCambio

                        if(cxp.fecha.getMonth() != egreso.fecha.month) {

                            Date nvaFecha = Periodo.inicioDeMes(egreso.fecha) - 2
                            TipoDeCambio tc = TipoDeCambio.where{fecha == nvaFecha}.find()
                            if(!tc) {
                                throw new RuntimeException("No existe Tipo de cambio para el ${nvaFecha}")
                            }
                            tipoDeCambio = tc.tipoDeCambio
                        }
                        String desc = """
                            ${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} 
                            ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})
                            TC: ${tipoDeCambio} 
                        """

                        poliza.addToPartidas(mapRow(cv, desc, row, MonedaUtils.round(cxp.diferencia  * tipoDeCambio)))

                        desc = """
                            ${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} 
                            ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})
                            TC: ${r.egreso.tipoDeCambio} 
                        """
                        poliza.addToPartidas(mapRow('704-0005-0000-0000', desc, row, 0.0, importe))

                    }
                }
            }
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
                referencia2: r.nombre,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS',
                ctaDestino: r.proveedor.cuentaBancaria,
                bancoDestino: r.proveedor.banco,
        ]

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"

        if(r.moneda == 'USD') {
            desc = desc + " TC: ${r.tipoDeCambio}"
        }
        BigDecimal tc = egreso.tipoDeCambio
        if(r.egreso.moneda == 'MXN') {
            tc = 1.00
        }
        BigDecimal importe = MonedaUtils.round(egreso.importe.abs() * tc)
        buildComplementoDePago(row, egreso)

        PolizaDet det = mapRow(ctaBanco, desc, row, 0.0, importe)
        poliza.addToPartidas(det)
    }

    @CompileDynamic
    void registrarRetenciones(Poliza poliza, Requisicion r) {
        MovimientoDeCuenta egreso = r.egreso
        Map row = [
                asiento: "PAGO_${egreso.tipo}",
                referencia: r.nombre,
                referencia2: r.nombre,
                origen: egreso.id,
                documento: egreso.referencia,
                documentoTipo: 'CXP',
                documentoFecha: egreso.fecha,
                sucursal: egreso.sucursal?: 'OFICINAS',
                ctaDestino: r.proveedor.cuentaBancaria,
                bancoDestino: r.proveedor.banco
        ]
        buildComplementoDePago(row, egreso)
        String desc = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "
        r.partidas.each {
            if(it.cxp.impuestoRetenido > 0) {
                CuentaPorPagar cxp = it.cxp
                if(cxp.impuestoRetenido > 0.0) {
                    row.documento = cxp.folio.toString()
                    row.documentoFecha  = cxp.fecha
                    desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                            " (${cxp.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                            " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"
                    BigDecimal imp = cxp.impuestoRetenido

                    // log.info('Retenido Fac: {} {} ', cxp.folio, imp)
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
        poliza.concepto = "${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} : ${r.egreso.referencia} ${r.egreso.afavor} (${r.egreso.fecha.format('dd/MM/yyyy')}) (${r.egreso.tipo})"
        if(r.moneda != 'MXN') {
            poliza.concepto = poliza.concepto + "TC: ${r.tipoDeCambio}"
        }
    }

    @CompileDynamic
    void ajustarProveedorBanco(Poliza poliza) {
        PolizaDet abonoBanco = poliza.partidas.find {it.cuenta.clave.startsWith('102')}
        List<PolizaDet> provs = poliza.partidas.findAll{it.cuenta.clave.startsWith('201')}
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



    Requisicion findRequisicion(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        RequisicionDeCompras r = RequisicionDeCompras.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Requisicion")
        return r
    }

    CuentaOperativaProveedor buscarCuentaOperativa(Proveedor p) {
        CuentaOperativaProveedor co = CuentaOperativaProveedor.where{proveedor == p}.find()
        if(!p) throw new RuntimeException("Proveedor ${p.nombre} sin cuenta operativa")
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
                moneda: row.moneda,
                tipCamb: row.tipCamb
        )
        // Datos del complemento
        if(row.uuid)
            asignarComprobanteNacional(det, row)
        if(row.metodoDePago){
            asignarComplementoDePago(det, row)
        }

        return det
    }

    def registrarVariacionCambiariaIva(Poliza p, Requisicion requisicion) {

        if(requisicion.moneda == 'MXN')
            return

        def grupos = p.partidas.findAll { it.cuenta.clave.startsWith('118') || it.cuenta.clave.startsWith('119') }
                .groupBy { it.origen }

        grupos.each {
            BigDecimal debe = it.value.sum 0.0, {r -> r.debe}
            BigDecimal haber = it.value.sum 0.0, {r -> r.haber}

            BigDecimal dif = debe - haber
            if(dif.abs() > 0.01 ){
                log.info("Registrando IVA de la variacion cambiaria: ${it.key} Debe: ${debe} Haber: ${haber} Dif: ${dif}")

                def det = it.value.find {it.cuenta.clave.startsWith('118')}

                if(dif > 0.0) {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('702-0004-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = det.sucursal
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.haber = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento + '_VC_IVA'
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    pdet.moneda = 'MXN'
                    pdet.tipCamb = 1.0
                    p.addToPartidas(pdet)

                } else {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('701-0001-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = det.sucursal
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.debe = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento+ '_VC_IVA'
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    pdet.moneda = 'MXN'
                    pdet.tipCamb = 1.0
                    p.addToPartidas(pdet)
                }
            }

        }
    }

    def registrarVariacionCambiaria(Poliza p, Requisicion requisicion) {

        PolizaDet banco = p.partidas.find {it.cuenta.clave.startsWith('102')}
        PolizaDet otrosProductosAnt = p.partidas.find {it.cuenta.clave.startsWith('704-0005')} // Caso AVERY

        if(banco.moneda == null || requisicion.moneda == 'MXN') {
            return
        }
        List<PolizaDet> procs = p.partidas.findAll {it.cuenta.clave.startsWith('201')}
        BigDecimal debe = procs.sum 0.0, {r -> r.debe}
        BigDecimal haber = banco.haber
        if(otrosProductosAnt) {
            haber = haber +otrosProductosAnt.haber
        }

        BigDecimal dif = debe - haber

        if(dif.abs() > 1.0 ){

            def det = banco

            if(dif > 0.0) {
                PolizaDet pdet = new PolizaDet()
                pdet.cuenta = buscarCuenta('702-0004-0000-0000')
                pdet.concepto = pdet.cuenta.descripcion
                pdet.sucursal = det.sucursal
                pdet.origen = det.origen
                pdet.referencia = det.referencia
                pdet.referencia2 = det.referencia2
                pdet.haber = dif.abs()
                pdet.descripcion = det.descripcion
                pdet.entidad = det.entidad
                pdet.asiento = det.asiento+ '_VC'
                pdet.documentoTipo = det.documentoTipo
                pdet.documentoFecha = det.documentoFecha
                pdet.documento = det.documento
                pdet.moneda = 'MXN'
                pdet.tipCamb = 1.0
                p.addToPartidas(pdet)

            } else {
                PolizaDet pdet = new PolizaDet()
                pdet.cuenta = buscarCuenta('701-0001-0000-0000')
                pdet.concepto = pdet.cuenta.descripcion
                pdet.sucursal = det.sucursal
                pdet.origen = det.origen
                pdet.referencia = det.referencia
                pdet.referencia2 = det.referencia2
                pdet.debe = dif.abs()
                pdet.descripcion = det.descripcion
                pdet.entidad = det.entidad
                pdet.asiento = det.asiento+ '_VC'
                pdet.documentoTipo = det.documentoTipo
                pdet.documentoFecha = det.documentoFecha
                pdet.documento = det.documento
                pdet.moneda = 'MXN'
                pdet.tipCamb = 1.0
                p.addToPartidas(pdet)
            }
        }

    }
}
