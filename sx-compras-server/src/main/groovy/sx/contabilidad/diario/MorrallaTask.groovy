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
        List<PagoDeMorralla> morrallas = PagoDeMorralla.where{fecha == poliza.fecha}list()
        morrallas.each{ morralla ->
            morralla.partidas.each{salida ->
                def suc = salida.sucursal.clave.padLeft(4,'0')
                List<Morralla> list = Morralla.executeQuery("from Morralla where date(fecha) = date(?) and  sucursal = ? and tipo ='SALIDA' ",[salida.fecha,salida.sucursal])
                log.info('List: {}', list)
                if(list) {
                    Morralla entrada = list.get(0)
                    String ctaCaja = "101-0001-${suc}-0000"
                    String ctaValores = "107-0006-${suc}-0000"
                    String ctaBanco = "102-0001-0002-0000"

                    Map row = [
                            asiento: "CAJA MORRALLA",
                            referencia: salida.comentario,
                            referencia2: salida.comentario,
                            origen: morralla.id,
                            documento: morralla.id,
                            documentoTipo: 'TES',
                            documentoFecha: salida.fecha,
                            sucursal: salida.sucursal.nombre,
                            montoTotal: salida.importe,
                            moneda: 'MXN',
                    ]
                    Map rowEnt = [
                            asiento: "CAJA MORRALLA ",
                            referencia: entrada.comentario,
                            referencia2: entrada.comentario,
                            origen: morralla.id,
                            documento: morralla.id,
                            documentoTipo: 'TES',
                            documentoFecha: entrada.fecha,
                            sucursal: entrada.sucursal.nombre,
                            montoTotal: entrada.importe,
                            moneda: 'MXN',
                    ]
                    String desc = generarDescripcion(row,salida.tipo)
                    poliza.addToPartidas(mapRow(ctaValores,desc,row,salida.importe))
                    poliza.addToPartidas(mapRow(ctaCaja,generarDescripcion(row,entrada.tipo) ,rowEnt,0.00,entrada.importe))
                    poliza.addToPartidas(mapRow(ctaCaja,desc,row,salida.importe))
                    poliza.addToPartidas(mapRow(ctaBanco,desc,row,0.00,salida.importe))

                }

            } 
        }
    }

    String generarDescripcion(Map row, String tipo ) {
        if(row.tc > 1.0) {
            return "F:${row.documento} (${row.documentoFecha}) ${tipo} "
        }
        return "F:${row.documento} (${row.documentoFecha}) ${tipo}"
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
                sucursal: 'OFICINAS',
                debe: debe.abs(),
                haber: haber.abs()
        )
        // Datos del complemento
        asignarComprobanteNacional(det, row)
        // asignarComplementoDePago(det, row)
        return det
    }

}