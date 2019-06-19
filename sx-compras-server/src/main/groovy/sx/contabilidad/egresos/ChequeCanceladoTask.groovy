package sx.contabilidad.egresos


import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.tesoreria.Cheque
import sx.tesoreria.CuentaDeBanco

@Slf4j
@GrailsCompileStatic
@Component
class ChequeCanceladoTask implements  AsientoBuilder, EgresoTask {

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
        log.info('CHEQUE: {}', poliza.egreso)
        Cheque cheque = Cheque.get(poliza.egreso)

        log.info("CHEQUE CANCELADO {}", cheque)
        abonoBanco(poliza, cheque)

    }


    void abonoBanco(Poliza poliza, Cheque cheque) {

        CuentaDeBanco cuenta = cheque.cuenta
        // Abono a Banco
        String ctaBanco = "102-0001-${cuenta.subCuentaOperativa}-0000"
        poliza.concepto = "CHEQUE CANCELADO ${cheque.folio} ${cheque.cuenta.descripcion} (${cheque.cuenta.numero}) ${cheque.nombre}"
        log.info('Poliza: {}',poliza.concepto)
        Map row = [
                asiento       : cheque.folio,
                referencia    : cheque.nombre,
                referencia2   : cheque.nombre,
                origen        : cheque.id,
                documento     : cheque.folio,
                documentoTipo : 'CHEQUE',
                documentoFecha: cheque.fecha,
                sucursal      : 'OFICINAS'
        ]
        String desc = poliza.concepto
        poliza.addToPartidas(mapRow(ctaBanco, desc, row, 0.0))
        poliza.addToPartidas(mapRow(ctaBanco, desc, row, 0.0, 0.0))

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
                debe: debe.abs(),
                haber: haber.abs(),
        )
        return det
    }
}
