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
class MorrallaTask implements  AsientoBuilder{

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
        List<PagoDeMorralla> morrallas = PagoDeMorralla.where{fecha == poliza.fecha}list()
        morrallas.each{ morralla ->
            ajustarConcepto(poliza, morralla)
            // String ctaBanco = "102-0001-0002-0000"
            String ctaBanco = "102-0001-${morralla.cuentaEgreso.subCuentaOperativa}-0000"
          
             Map rowMor = [
                            asiento: "CAJA MORRALLA ",
                            referencia: morralla.proveedor.nombre,
                            referencia2: morralla.proveedor.nombre,
                            origen: morralla.id,
                            documento: morralla.id,
                            documentoTipo: 'TES',
                            documentoFecha:morralla.fecha,
                            sucursal: 'OFICINAAS',
                            montoTotal: morralla.importe,
                            moneda: 'MXN',
                    ]
            String descripcion = generarDescripcion(rowMor, morralla.proveedor.nombre,'')
            morralla.partidas.each{salida ->
                def suc = salida.sucursal.clave.padLeft(4,'0')
              //  List<Morralla> list = Morralla.executeQuery("from Morralla where date(fecha) = date(?) and  sucursal = ? and tipo ='SALIDA' ",[salida.fecha,salida.sucursal])
              //  log.info('List: {}', list)
                    String ctaCaja = "101-0001-${suc}-0000"
                    String ctaValores = "107-0006-${suc}-0000"
                    
                    MovimientoDeCuenta egreso = morralla.egreso

                    Map row = [
                            asiento: "CAJA MORRALLA",
                            referencia: morralla.proveedor.nombre,
                            referencia2: morralla.proveedor.nombre,
                            origen: morralla.id,
                            documento: morralla.id,
                            documentoTipo: 'TES',
                            documentoFecha: salida.fecha,
                            sucursal: salida.sucursal.nombre,
                            montoTotalDePago: salida.importe,
                            moneda: 'MXN',
                            metodoDePago: '03',
                            beneficiario: morralla.proveedor.nombre,
                            bancoOrigen: egreso.cuenta.bancoSat.clave,
                    ]

                String desc = generarDescripcion(row, morralla.proveedor.nombre, salida.tipo)
                poliza.addToPartidas(mapRow(ctaValores,desc,row,salida.importe))
               
                poliza.addToPartidas(mapRow(ctaCaja,desc,row,salida.importe))
                 poliza.addToPartidas(mapRow(ctaValores,desc,row,0.00,salida.importe))
                /*
                if (list){
                    Morralla entrada = list.get(0)
                    Map rowEnt = [
                            asiento: "CAJA MORRALLA ",
                            referencia: morralla.proveedor.nombre,
                            referencia2: morralla.proveedor.nombre,
                            origen: morralla.id,
                            documento: morralla.id,
                            documentoTipo: 'TES',
                            documentoFecha: entrada.fecha,
                            sucursal: salida.sucursal.nombre,
                            montoTotal: entrada.importe,
                            moneda: 'MXN',
                    ]
                    
                   // poliza.addToPartidas(mapRow(ctaCaja,generarDescripcion(row, morralla.proveedor.nombre, entrada.tipo) ,rowEnt,0.00,entrada.importe))s 
                }*/

            } 
             poliza.addToPartidas(mapRow(ctaBanco,descripcion,rowMor,0.00,morralla.importe))

        }
    }

    String generarDescripcion(Map row, String proveedor, String tipo ) {
        return "F:${row.documento} ${proveedor} (${row.documentoFecha.format('dd/MM/yyyy')}) ${tipo}"
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