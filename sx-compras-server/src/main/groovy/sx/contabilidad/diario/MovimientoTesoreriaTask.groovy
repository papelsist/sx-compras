package sx.contabilidad.diario


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Empresa
import sx.tesoreria.MovimientoDeTesoreria
import sx.tesoreria.MovimientoDeCuenta



@Slf4j
@Component
class MovimientoTesoreriaTask implements  AsientoBuilder{

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
       //procesarIntereses(poliza)
       //procesarRetencionesIsr(poliza)
       procesarDepositosPorIdentificar(poliza)
    }

    void procesarIntereses(Poliza poliza){
        def movimientosTes = MovimientoDeTesoreria.executeQuery("from MovimientoDeTesoreria where fecha= ? and concepto ='DEPOSITO' and  comentario like '%INTERES%'",[poliza.fecha])
        movimientosTes.each{mov ->mov.movimiento.moneda
            String ctaBanco= "102-${mov.movimiento.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${mov.movimiento.cuenta.subCuentaOperativa}-0000"
             Map row = [
                    asiento: "INTERESES BANCARIOS",
                    referencia: mov.comentario,
                    referencia2: mov.comentario,
                    origen: mov.id,
                    documento: mov.id,
                    documentoTipo: 'TES',
                    documentoFecha: mov.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: mov.importe,
                    moneda: mov.movimiento.moneda, 
                ] 
            String desc = generarDescripcion(row)  
            poliza.addToPartidas(mapRow(ctaBanco,desc,row,mov.importe)) 
            poliza.addToPartidas(mapRow('702-0001-0000-0000',desc,row,0.00,mov.importe)) 
        }
    }

    void procesarRetencionesIsr(Poliza poliza){
        def movimientosTes = MovimientoDeTesoreria.executeQuery("from MovimientoDeTesoreria where fecha= ? and concepto ='CARGO' and  comentario like '%RET%ISR%'",[poliza.fecha])
        movimientosTes.each{mov ->mov.movimiento.moneda
            String ctaBanco= "102-${mov.movimiento.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${mov.movimiento.cuenta.subCuentaOperativa}-0000"
             Map row = [
                    asiento: "RETENCIONES ISR",
                    referencia: mov.comentario,
                    referencia2: mov.comentario,
                    origen: mov.id,
                    documento: mov.id,
                    documentoTipo: 'TES',
                    documentoFecha: mov.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: mov.importe,
                    moneda: mov.movimiento.moneda, 
                ] 
            String desc = generarDescripcion(row)  
            poliza.addToPartidas(mapRow('750-0002-0000-0000',desc,row,mov.importe))
            poliza.addToPartidas(mapRow(ctaBanco,desc,row,0.00,mov.importe)) 
        }
    }

    void procesarDepositosPorIdentificar(Poliza poliza){
        def movimientosTes = MovimientoDeTesoreria.executeQuery("from MovimientoDeTesoreria where fecha= ? and concepto ='DEP_PENDIENTE_ACLARAR'",[poliza.fecha])
        movimientosTes.each{mov ->mov.movimiento.moneda
            String ctaBanco= "102-${mov.movimiento.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${mov.movimiento.cuenta.subCuentaOperativa}-0000"
             Map row = [
                    asiento: "DEPOSITO POR IDENTIFICAR",
                    referencia: mov.comentario,
                    referencia2: mov.comentario,
                    origen: mov.id,
                    documento: mov.id,
                    documentoTipo: 'TES',
                    documentoFecha: mov.fecha,
                    sucursal: 'OFICINAS',
                    montoTotal: mov.importe,
                    moneda: mov.movimiento.moneda, 
                ] 
            String desc = generarDescripcion(row) 
            poliza.addToPartidas(mapRow(ctaBanco,desc,row,mov.importe))
            def ctaOpDep=mov.movimiento.cuenta.subCuentaOperativa 
            BigDecimal importe= (mov.importe / 1.16).setScale(2, BigDecimal.ROUND_HALF_EVEN); 
            poliza.addToPartidas(mapRow("205-0002-${ctaOpDep}-0000",desc,row,0.00,importe)) 
            def iva = mov.importe - importe
            poliza.addToPartidas(mapRow("208-0003-0000-0000",desc,row,0.00,iva)) 
        }
    }

    String generarDescripcion(Map row) {
        if(row.tc > 1.0) {
            return "F:${row.documento} (${row.documentoFecha})"
        }
        return "F:${row.documento} (${row.documentoFecha}) "
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
                entidad: 'MovimientoDeTesoreria',
                documento: row.documento,
                documentoTipo: 'TES',
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