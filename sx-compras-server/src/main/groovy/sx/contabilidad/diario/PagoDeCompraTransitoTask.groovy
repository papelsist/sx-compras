package sx.contabilidad.diario

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
import sx.cxp.AnalisisDeFactura
import sx.cxp.CuentaPorPagar
import sx.cxp.Requisicion
import sx.cxp.RequisicionDeCompras
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils
import sx.core.TipoDeCambio
import sx.utils.Periodo

@Slf4j
@Component
class PagoDeCompraTransitoTask implements  AsientoBuilder{

    /**
     * Genera los asientos requreidos por la poliza
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
        registrarVariacionCambiariaIva(poliza, r)

    }

    /**
     * Genera n cargos a proveedor, uno por cada factura mencionada en la requisicion
     *
     * @param poliza
     * @param r
     */
    void cargoProveedor(Poliza poliza, RequisicionDeCompras r) {
        CuentaOperativaProveedor co = buscarCuentaOperativa(r.proveedor)
        MovimientoDeCuenta egreso = r.egreso
        r.partidas.each {
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

            BigDecimal totalFactura = cxp.total
            BigDecimal apagar = it.apagar ?: 0.0  // a pagar requisicion
            BigDecimal dif = totalFactura - apagar // Diferencia para saber si existe DESC
    
            BigDecimal impuestoTrasladado = cxp.impuestoTrasladado - (cxp.impuestoRetenido?:0.0)
            tipoDeCambio = egreso.tipoDeCambio
            if(r.moneda != egreso.moneda.currencyCode) {
                tipoDeCambio = r.tipoDeCambio
            }
            BigDecimal impuestoTrasladadoPara118 = MonedaUtils.round(impuestoTrasladado * tipoDeCambio)
            BigDecimal impuestoTrasladadoPara119 = MonedaUtils.round(impuestoTrasladado * cxp.tipoDeCambio)

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
            
            // IVA
            BigDecimal importe = MonedaUtils.calcularImporteDelTotal(it.apagar * r.tipoDeCambio)
            BigDecimal impuesto = it.apagar - importe

            poliza.addToPartidas(mapRow('118-0001-0000-0000', desc, row, impuestoTrasladadoPara118))
            poliza.addToPartidas(mapRow('119-0001-0000-0000', desc, row, 0.0, impuestoTrasladadoPara119))
        }
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
      //  buildComplementoDePago(row, egreso)
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
        )
        // Datos del complemento
        if(row.uuid)
            asignarComprobanteNacional(det, row)
        if(row.metodoDePago)
            asignarComplementoDePago(det, row)
        return det
    }

/*
    def registrarVariacionCambiariaIva(Poliza p, Requisicion requisicion) {

        log.info("Registrando variacion cambiaria {}", requisicion.partidas.size())

        requisicion.partidas.each{ det ->
            def cxp = det.cxp
            log.info("cxpMoneda {} ,reqMoneda {}", cxp.moneda, requisicion.moneda)
            if(cxp.moneda != requisicion.moneda){

                BigDecimal ii = MonedaUtils.calcularImporteDelTotal(cxp.total * cxp.tipoDeCambio)
                def ivaCxp = MonedaUtils.calcularImpuesto(ii) 
                
                BigDecimal iii = MonedaUtils.calcularImporteDelTotal(det.apagar * requisicion.tipoDeCambio)
                def ivaPago = MonedaUtils.calcularImpuesto(iii) 
            
                def dif = ivaCxp - ivaPago
                log.info("Cxp: {} Pago: {}  {}",ivaCxp,ivaPago, dif)


                if(dif < 0){
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('702-0004-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = 'OFICINAS'
                    pdet.origen = det.id
                    pdet.referencia = requisicion.nombre
                    pdet.referencia2 = requisicion.nombre
                    pdet.haber = dif.abs()
                    pdet.descripcion =  p.concepto
                    pdet.entidad = 'Requisicion'
                    pdet.asiento = 'Variacion Cambiaria'
                    pdet.documentoTipo = cxp.tipo
                    pdet.documentoFecha = cxp.fecha
                    pdet.documento = cxp.folio
                    pdet.moneda = requisicion.moneda
                    pdet.tipCamb = requisicion.tipoDeCambio
                    p.addToPartidas(pdet)
                } else {
                     PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('701-0001-0000-0000')
                    pdet.concepto = pdet.cuenta.descripcion
                    pdet.sucursal = 'OFICINAS'
                    pdet.origen = det.id
                    pdet.referencia = requisicion.nombre
                    pdet.referencia2 = requisicion.nombre
                    pdet.debe = dif.abs()
                    pdet.descripcion =  p.concepto
                    pdet.entidad = 'Requisicion'
                    pdet.asiento = 'Variacion Cambiaria'
                    pdet.documentoTipo = cxp.tipo
                    pdet.documentoFecha = cxp.fecha
                    pdet.documento = cxp.folio
                    pdet.moneda = requisicion.moneda
                    pdet.tipCamb = requisicion.tipoDeCambio
                    p.addToPartidas(pdet)
                }
           // }

        }
    }
*/   

    def registrarVariacionCambiariaIva(Poliza p, Requisicion requisicion) {

        if(requisicion.moneda == 'MXN')
            return

        def grupos = p.partidas.findAll { it.cuenta.clave.startsWith('118') || it.cuenta.clave.startsWith('119') }
                .groupBy { it.origen }

        grupos.each {
            def debe = it.value.sum 0.0, {r -> r.debe}
            def haber = it.value.sum 0.0, {r -> r.haber}

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


}
