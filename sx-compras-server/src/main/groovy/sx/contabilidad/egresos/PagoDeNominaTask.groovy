package sx.contabilidad.egresos

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.core.Empresa
import sx.tesoreria.MovimientoDeCuenta
import sx.tesoreria.PagoDeNomina


@Slf4j
@Component
class PagoDeNominaTask implements  AsientoBuilder, EgresoTask {

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
        PagoDeNomina nomina = findPago(poliza)

        log.info("Pago de Nomina: {} {}", nomina.folio, nomina.egreso)
        cargoNominasPorPagar(poliza, nomina)
        abonoBanco(poliza, nomina)
    }

    /**
     * Genera n cargos a proveedor, uno por cada factura mencionada en la requisicion
     *
     * @param poliza
     * @param r
     */
    void cargoNominasPorPagar(Poliza poliza, PagoDeNomina nomina) {
        log.info('Cargo a nominas por pagar {}', nomina.egreso)
        MovimientoDeCuenta egreso = nomina.egreso
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia}  ${egreso.afavor} "
        Map row = [
                asiento: "${egreso.tipo}",
                referencia: nomina.afavor,
                referencia2: egreso.cuenta.descripcion,
                origen: egreso.id,
                documentoTipo: 'NOMINA',
                sucursal: 'OFICINAS'
        ]

        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        //
        String cv = "210-0001-0000-0000"
        if(nomina.pensionAlimenticia) {
            // poliza.concepto = poliza.concepto + " PA"
            MovimientoDeCuenta mov = nomina.egreso
            poliza.concepto = "CH ${mov.referencia} ${mov.afavor} (${mov.fecha.format('dd/MM/yyyy')})" +
                    " (${mov.tipo} ${mov.tipo != mov.concepto ? mov.concepto : ''}) PA"
            cv = "205-D007-${nomina.pensionAlimenticiaId.toString().padLeft(4, '0')}-0000"
        }
        poliza.addToPartidas(toPolizaDet(cv, desc, row, egreso.importe))

    }

    void abonoBanco(Poliza poliza, PagoDeNomina nomina) {
        MovimientoDeCuenta egreso = nomina.egreso
        log.info('Abono a banco: {}', egreso)

        // Abono a Banco
        Map row = buildDataRow(egreso)
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        String desc = row.descripcion
        poliza.addToPartidas(toPolizaDet(
                buildCuentaDeBanco(egreso),
                desc,
                row,
                0.0,
                egreso.importe.abs()))
    }


    PagoDeNomina findPago(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        PagoDeNomina r = PagoDeNomina.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene PagoDeNomina")
        return r
    }



    PolizaDet toPolizaDet(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

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
        if(row.metodoDePago) {
            asignarComplementoDePago(det, row)
            det.moneda = row.moneda
            det.tipCamb = row.tipCamb

        }
        return det
    }

}
