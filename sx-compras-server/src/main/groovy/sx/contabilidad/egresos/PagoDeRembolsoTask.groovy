package sx.contabilidad.egresos


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
class PagoDeRembolsoTask implements  AsientoBuilder, EgresoTask {

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
        switch (r.concepto) {
            case 'REMBOLSO':
                cargoSucursal(poliza, r)
                break
            case 'GASTO':
                atenderGasto(poliza, r)
            default:
                log.info('No hay handler para: {}', r.concepto)
        }
        abonoBanco(poliza, r)

    }


    void cargoSucursal(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        // String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia}  ${r.sucursal.nombre} "
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        Map row = [
                asiento: "PAGO_${egreso.tipo}_${r.concepto}",
                referencia: r.nombre,
                referencia2: egreso.cuenta.descripcion,
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc
        // Cargo a caja
        String cv = "101-0002-${r.sucursal.clave.padLeft(4,'0')}-0000"
        poliza.addToPartidas(mapRow(cv, desc, row, egreso.importe))
    }

    void abonoBanco(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        log.info('Abono a banco: {}', egreso)

        // Abono a Banco
        Map row = buildDataRow(egreso)
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        poliza.addToPartidas(mapRow(
                buildCuentaDeBanco(egreso),
                desc,
                row,
                0.0,
                egreso.importe.abs()))
    }

    def atenderGasto(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        r.partidas.each { d ->
            CuentaPorPagar cxp = d.cxp
            String ctaOperativa = '0999'
            if(cxp) {
                CuentaOperativaProveedor co = CuentaOperativaProveedor.where{ proveedor == cxp.proveedor}.find()
                if(!co) throw new RuntimeException("No existe cuenta operativa para el proveedor: ${cxp.proveedor}")
                ctaOperativa = co.getCuentaOperativa()
            }
            CuentaContable cuenta = ctaPadre.subcuentas.find{it.clave.contains(ctaOperativa)}
            BigDecimal importe = d.apagar
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp.serie?:''} ${cxp.folio}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
            poliza.addToPartidas(mapRow(cuenta, desc, row, importe))
        }
    }





    Rembolso findRembolso(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        Rembolso r = Rembolso.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Requisicion")
        return r
    }



    PolizaDet mapRow(CuentaContable cuenta, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

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
