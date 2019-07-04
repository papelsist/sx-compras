package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.utils.Periodo
import sx.tesoreria.MovimientoDeTesoreria
import sx.tesoreria.MovimientoDeCuenta

@Slf4j
@Component
class DepositosTesoreriaProc implements  ProcesadorDePoliza, AsientoBuilder{

    @Override
    String definirConcepto(Poliza poliza) {
            return "DEPOSITOS TESORERIA ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
            procesarDepositos(poliza)
    }


   def procesarDepositos(Poliza poliza) {
        def movimientosTes = MovimientoDeTesoreria.executeQuery("from MovimientoDeTesoreria where fecha= ? and concepto in ('DEPOSITO_DEUDOR','DEVOLUCION_NOMINA','DEP_ACUENTA_PRESTAMO','DEVOLUCION_ASEGURADORA')",[poliza.fecha])

        movimientosTes.each{mov ->

            String ctaBanco= "102-${mov.movimiento.moneda.currencyCode == 'MXN' ? '0001': '0002'}-${mov.movimiento.cuenta.subCuentaOperativa}-0000"
            Map row = [
                    asiento: mov.concepto,
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
                    poliza.addToPartidas(mapRow(mov.cuentaContable,desc,row,0.00,mov.importe))       
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
