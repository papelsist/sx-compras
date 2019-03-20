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
        cargoSucursal(poliza, r)
        abonoBanco(poliza, r)

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
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc
        // Cargo a caja
        String cv = "101-0002-${r.sucursal.clave.padLeft(4,'0')}-0000"
        poliza.addToPartidas(mapRow(cv, desc, row, egreso.importe))

            if(egreso.cheque.fecha.format('dd/MM/yyyy') == egreso.cheque.fechaTransito.format('dd/MM/yyyy')){
             
                // IVA
                BigDecimal importe = MonedaUtils.calcularImporteDelTotal(r.apagar * r.tipoDeCambio)
                BigDecimal impuesto = r.apagar - importe
                poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, impuesto))
                poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, impuesto))

            }
         
        

    }

    void abonoBanco(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        log.info('Abono a banco: {}', egreso)

        // Abono a Banco
        Map row = buildDataRow(egreso)
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        String desc = row.descripcion
        poliza.addToPartidas(mapRow(
                buildCuentaDeBanco(egreso),
                desc,
                row,
                0.0,
                egreso.importe.abs()))
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
