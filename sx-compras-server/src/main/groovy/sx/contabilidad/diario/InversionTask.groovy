package sx.contabilidad.diario


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Empresa
import sx.tesoreria.Inversion

import sx.tesoreria.MovimientoDeCuenta



@Slf4j
@Component
class InversionTask implements  AsientoBuilder{

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
        println  "Generando Asientos desde Inversion Task"
        def inversiones = Inversion.findAllByFechaOrRendimientoFecha(poliza.fecha,poliza.fecha)
        inversiones.each{inv ->
            if(inv.fecha == poliza.fecha && inv.rendimientoFecha){
                procesarInversion(poliza, inv)
            }
            if(inv.fecha == poliza.fecha && !inv.rendimientoFecha){
                procesarInversionSinRendimiento(poliza, inv)
            }
            if(inv.rendimientoFecha == poliza.fecha){
                if(inv.cuentaOrigen.subCuentaOperativa == "0003"){
                    procesarRendimiento(poliza, inv)
                }
               
            }
        }
    }

    void procesarInversion(Poliza poliza, Inversion inv){
        Map rowDestino = [
                    asiento: "INVERSION ",
                    referencia: "Inversion de : ${inv.cuentaOrigen.descripcion} (${inv.cuentaOrigen.numero})",
                    referencia2: "Inversion de : ${inv.cuentaOrigen.descripcion} (${inv.cuentaOrigen.numero})",
                    origen: inv.id,
                    documento: inv.id,
                    documentoTipo: 'TES',
                    documentoFecha: inv.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: inv.importe,
                    moneda: inv.moneda, 
                ] 

            
        String ctaDestino= "103-${inv.moneda == 'MXN' ? '0001': '0002'}-${inv.cuentaDestino.subCuentaOperativa}-0000"
        String desc = generarDescripcion(rowDestino, inv.tasa)  
        poliza.addToPartidas(mapRow(ctaDestino,desc,rowDestino,inv.importe))
        Map rowOrigen = [
                    asiento: "INVERSION ",
                    referencia: "Inversion a : ${inv.cuentaDestino.descripcion} (${inv.cuentaDestino.numero})",
                    referencia2: "Inversion a : ${inv.cuentaDestino.descripcion} (${inv.cuentaDestino.numero})",
                    origen: inv.id,
                    documento: inv.id,
                    documentoTipo: 'TES',
                    documentoFecha: inv.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: inv.importe,
                    moneda: inv.moneda, 
                ] 
        String ctaOrigen= "102-${inv.moneda == 'MXN' ? '0001': '0002'}-${inv.cuentaOrigen.subCuentaOperativa}-0000"
        desc = generarDescripcion(rowOrigen, inv.tasa)  
        poliza.addToPartidas(mapRow(ctaOrigen,desc,rowOrigen,0.00,inv.importe))    
    }

    void procesarInversionSinRendimiento(Poliza poliza, Inversion inv){
        inv.movimientos.each{mov ->
            def bco = '102'
            if(mov.cuenta.tipo == 'INVERSION'){
                bco = '103'
            }
            String ctaBanco = "${bco}-${mov.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${mov.cuenta.subCuentaOperativa}-0000"
            Map row = [
                    asiento: "INVERSION",
                    referencia: mov.conceptoReporte,
                    referencia2: mov.comentario,
                    origen: inv.id,
                    documento: inv.id,
                    documentoTipo: 'TES',
                    documentoFecha: inv.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: mov.importe,
                    moneda: mov.moneda, 
                ] 
            String desc = generarDescripcion(row, inv.tasa)  
            if(mov.concepto == 'DEPOSITO'){
                poliza.addToPartidas(mapRow(ctaBanco,desc,row,mov.importe - inv.rendimientoReal))
            }
            if(mov.concepto == 'RETIRO'){
                poliza.addToPartidas(mapRow(ctaBanco,desc,row,0.00,mov.importe  ))
               // poliza.addToPartidas(mapRow('702-0001-0000-0000',desc,row,0.00,inv.rendimientoReal))
            }   
        }  
    }

    void procesarRendimiento(Poliza poliza,Inversion inv){
        String ctaDestino= "103-${inv.moneda == 'MXN' ? '0001': '0002'}-${inv.cuentaDestino.subCuentaOperativa}-0000"
        String ctaOrigen= "102-${inv.moneda == 'MXN' ? '0001': '0002'}-${inv.cuentaOrigen.subCuentaOperativa}-0000"
        def rendimientoNeto = inv.rendimientoReal - inv.isrImporte
        
        Map  row = [
                    asiento: "INVERSION RETORNO",
                    referencia: "Retorno Inversion de : ${inv.cuentaDestino.descripcion} (${inv.cuentaDestino.numero})",
                    referencia2: "Retorno Inversion de : ${inv.cuentaDestino.descripcion} (${inv.cuentaDestino.numero})",
                    origen: inv.id,
                    documento: inv.id,
                    documentoTipo: 'TES',
                    documentoFecha: inv.rendimientoFecha,
                    sucursal: 'OFICINAS',
                    montoTotal: rendimientoNeto,
                    moneda: inv.moneda, 
                ] 
        String desc = generarDescripcion(row, inv.tasa)  
        poliza.addToPartidas(mapRow(ctaDestino,desc,row,inv.rendimientoReal)) 
        poliza.addToPartidas(mapRow('750-0002-0000-0000',desc,row,inv.isrImporte))
        poliza.addToPartidas(mapRow('702-0001-0000-0000',desc,row,0.00,inv.rendimientoReal+inv.isrImporte))
        row = [
                    asiento: "INVERSION RETORNO",
                    referencia: "Retorno Inversion : ${inv.cuentaDestino.descripcion} (${inv.cuentaDestino.numero})",
                    referencia2: "Retorno Inversion : ${inv.cuentaDestino.descripcion} (${inv.cuentaDestino.numero})",
                    origen: inv.id,
                    documento: inv.id,
                    documentoTipo: 'TES',
                    documentoFecha: inv.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: inv.importe,
                    moneda: inv.moneda, 
                ]  
        desc = generarDescripcion(row, inv.tasa)  
        poliza.addToPartidas(mapRow(ctaOrigen,desc,row,inv.importe + inv.rendimientoReal))   
        row = [
                    asiento: "INVERSION RETORNO ",
                    referencia: "Retorno Inversion : ${inv.cuentaOrigen.descripcion} (${inv.cuentaOrigen.numero})",
                    referencia2: "Retorno Inversion : ${inv.cuentaOrigen.descripcion} (${inv.cuentaOrigen.numero})",
                    origen: inv.id,
                    documento: inv.id,
                    documentoTipo: 'TES',
                    documentoFecha: inv.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: inv.importe,
                    moneda: inv.moneda, 
                ] 
        desc = generarDescripcion(row, inv.tasa)  
        poliza.addToPartidas(mapRow(ctaDestino,desc,row,0.00,inv.importe + inv.rendimientoReal))
         
    }

    String generarDescripcion(Map row, def tasa  ) {
        if(row.tc > 1.0) {
            return "F:${row.documento} (${row.documentoFecha}) tasa: ${tasa} "
        }
        return "F:${row.documento} (${row.documentoFecha})  tasa: ${tasa} "
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
                entidad: 'Inversion',
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