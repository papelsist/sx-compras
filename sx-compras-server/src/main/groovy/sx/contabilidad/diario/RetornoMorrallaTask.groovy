package sx.contabilidad.diario


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Empresa
import sx.tesoreria.Morralla
import sx.tesoreria.PagoDeMorralla
import sx.tesoreria.MovimientoDeCuenta
import sx.core.Sucursal



@Slf4j
@Component
class RetornoMorrallaTask implements  AsientoBuilder{

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
        println "Generando Asientos desde Morralla task ..."
        procesarMorralla(poliza) 
    }

    void procesarMorralla(Poliza poliza){
        String rfc = Empresa.first().rfc
        List<MovimientoDeCuenta> morrallas =MovimientoDeCuenta.where{fecha == poliza.fecha && tipo == 'MORRALLA' && concepto == 'ABONO_MORRALLA'}list() 

        morrallas.each{morralla ->
            log.info("Morralla {}",morralla.comentario)
            def suc = Sucursal.findByNombre(morralla.sucursal).clave.padLeft(4,'0') //salida.sucursal.clave.padLeft(4,'0')
            String ctaCaja = "101-0001-${suc}-0000"
            String ctaBanco = "102-0001-0002-0000"
            Map row = [
                        asiento: "ABONO MORRALLA",
                        referencia: morralla.afavor,
                        referencia2: morralla.afavor,
                        origen: morralla.id,
                        documento: morralla.id,
                        documentoTipo: 'TES',
                        documentoFecha: morralla.fecha,
                        sucursal: morralla.sucursal,
                        montoTotalDePago: morralla.importe,
                        moneda: 'MXN',
                        metodoDePago: '03',
                        beneficiario: morralla.sucursal,
                        bancoOrigen: morralla.cuenta.bancoSat.clave,
                ]
                String desc = generarDescripcion(row, morralla.afavor, morralla.tipo)
                 log.info("Desc {}", desc)
                 poliza.addToPartidas(mapRow(ctaBanco,desc,row,morralla.importe))
                 poliza.addToPartidas(mapRow(ctaCaja,desc,row,0.00,morralla.importe))
        }
    }

    String generarDescripcion(Map row, String proveedor, String tipo ) {
        return "${proveedor} (${row.documentoFecha.format('dd/MM/yyyy')}) ${tipo}"
    }

    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {
        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'Morralla',
                documento: row.documento,
                documentoTipo: 'FAC',
                documentoFecha: row.fecha_doc,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )
        // Datos del complemento
        // asignarComprobanteNacional(det, row)
        asignarComplementoDePago(det, row)
        return det
    }

    void ajustarConcepto(Poliza poliza, PagoDeMorralla r) {
        poliza.concepto = """
        ${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'}  ${r.egreso.referencia} ${r.proveedor.nombre} 
        (${r.egreso.fecha.format('dd/MM/yyyy')}) (${r.egreso.tipo} : ${r.id.toString()})
        """


    }

}