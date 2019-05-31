package sx.contabilidad.diario


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Empresa
import sx.tesoreria.Traspaso
import sx.tesoreria.MovimientoDeCuenta



@Slf4j
@Component
class TraspasoTask implements  AsientoBuilder{

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
       procesarTraspasos(poliza)
    }

    void procesarTraspasos(Poliza poliza){
        List<Traspaso> traspasos = Traspaso.where{fecha == poliza.fecha}list()
        traspasos.each{ traspaso ->
                traspaso.movimientos.sort{-it.importe}.each{ mov ->
                   
                    Map row = [
                        asiento: "TRASPASO ENTRE CUENTAS ${mov.concepto}",
                        referencia: mov.comentario,
                        referencia2: mov.afavor,
                        origen: traspaso.id,
                        documento: traspaso.id,
                        documentoTipo: 'TES',
                        documentoFecha: mov.fecha,
                        sucursal: mov.sucursal?: 'OFICINAS',
                        montoTotal: mov.importe,
                        moneda: mov.moneda, 
                    ] 
                    String desc = generarDescripcion(row, mov.concepto)
                    String ctaBanco = "102-${mov.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${mov.cuenta.subCuentaOperativa}-0000"
                    
                    if(mov.concepto =='DEPOSITO' ){
                        poliza.addToPartidas(mapRow(ctaBanco,desc,row,mov.importe))
                    }
                    if(mov.concepto =='RETIRO' ){
                        poliza.addToPartidas(mapRow(ctaBanco,desc,row,0.00,mov.importe))
                    }
                    if(mov.concepto =='COMISION' ){
                        String ctaComision ="600-0014-0001-0000" 
                        poliza.addToPartidas(mapRow(ctaComision,desc,row,mov.importe))
                        poliza.addToPartidas(mapRow(ctaBanco,desc,row,0.00,mov.importe))
                    }
                    if(mov.concepto =='IVA' ){
                        String ctaIvaComision ="118-0002-0000-0000" 
                        poliza.addToPartidas(mapRow(ctaIvaComision,desc,row,mov.importe))
                        poliza.addToPartidas(mapRow(ctaBanco,desc,row,0.00,mov.importe))
                    }
                    
                }
        }
    }

    String generarDescripcion(Map row, String concepto) {
        if(row.tc > 1.0) {
            return "F:${row.documento} (${row.documentoFecha}) T.C. ${row.tc} ${concepto}"
        }
        return "F:${row.documento} (${row.documentoFecha}) ${concepto} "
    }

    String generarCuentaBanco(){
       // String ctaBanco = "102-${egreso.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${egreso.cuenta.subCuentaOperativa}-0000"
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
                entidad: 'Traspaso',
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