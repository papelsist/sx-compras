package sx.contabilidad.diario


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Empresa

import sx.cxp.CuentaPorPagar
import sx.cxp.Rembolso
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils

@Slf4j
@Component
class PagoDeRembolsoTransitoTask implements  AsientoBuilder{

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
        Rembolso r = findRembolso(poliza)

        log.info("Pago de REMBOLSO: {} {}", r.concepto, r.id)
        cargoSucursal(poliza, r)
        registrarRetenciones(poliza, r)
       

    }

    /**
     * Genera n cargos a proveedor, uno por cada factura mencionada en la requisicion
     *
     * @param poliza
     * @param r
     */
    void cargoSucursal(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia}  ${r.sucursal.nombre} "
        Map row = [
                asiento: "PAGO_${egreso.tipo}_${r.concepto}",
                referencia: r.nombre,
                referencia2: egreso.cuenta.descripcion,
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]

/*
        BigDecimal importe = MonedaUtils.calcularImporteDelTotal(r.apagar * r.tipoDeCambio)
            BigDecimal impuesto = r.apagar - importe
            poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, impuesto))
            poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, impuesto))
       */
       r.partidas.each{

            CuentaPorPagar cxp = it.cxp
            BigDecimal ivaCfdi = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva
            BigDecimal dif = cxp.total -it.apagar

            def iva119 = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva

              if(dif.abs() > 3.00) {
                    BigDecimal ii = MonedaUtils.calcularImporteDelTotal(it.apagar)
                    ivaCfdi = MonedaUtils.calcularImpuesto(ii)
                    
                    BigDecimal iii = MonedaUtils.calcularImporteDelTotal(cxp.total * cxp.tipoDeCambio)
                    iva119 = MonedaUtils.calcularImpuesto(iii) 
                }

                 // IVA
                poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaCfdi))
                poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, ivaCfdi))
              /*   
                BigDecimal importe = MonedaUtils.calcularImporteDelTotal(it.apagar * r.tipoDeCambio)
                BigDecimal impuesto = it.apagar - importe
                poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, impuesto))
                poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, impuesto))
            */ 

       }
    }


    void registrarRetenciones(Poliza poliza, Rembolso r) {

        println "REgistrando retenciones"
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

        String desc2 = "Folio: ${egreso.referencia} (${egreso.fecha.format('dd/MM/yyyy')}) "

        r.partidas.each {
            if(it.cxp.impuestoRetenido > 0) {

                println "Si tiene impuesto retenido"

                CuentaPorPagar cxp = it.cxp
                String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} " +
                    " ${cxp.tipoDeCambio > 1.0 ? 'T.C:' + cxp.tipoDeCambio: ''}"

                    println "*********** -----------  "+cxp.impuestoRetenidoIva
                if(cxp.impuestoRetenidoIva > 0.0) {
                    BigDecimal imp = cxp.impuestoRetenidoIva
                    println "***********   "+imp
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

  





    Rembolso findRembolso(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        Rembolso r = Rembolso.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Requisicion")
        return r
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
        if(row.metodoDePago) {
            asignarComplementoDePago(det, row)
            det.moneda = row.moneda
            det.tipCamb = row.tipCamb

        }

        return det
    }

}
