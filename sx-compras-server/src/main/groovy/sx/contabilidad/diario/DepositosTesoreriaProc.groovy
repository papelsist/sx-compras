package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.utils.Periodo

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
            
    }


   def procesarDepositos(Poliza poliza) {
        def movimientosTes = MovimientoDeTesoreria.executeQuery("from MovimientoDeTesoreria where fecha= ? and concepto in ('DEPOSITO_DEUDOR','DEVOLUCION_NOMINA','DEP_ACUENTA_PRESTAMO','DEVOLUCION_ASEGURADORA')",[poliza.fecha])

        movimientosTes.each{mov ->
            switch(mov.concepto) {
                case 'DEPOSITO_DEUDOR':
                    
                break
                case 'DEVOLUCION_NOMINA':
                    
                break

            }
        }

   }

 String generarDescripcion(Map row) {
        if(row.tc > 1.0) {
            return "F:${row.documento} (${row.documentoFecha})"
        }
        return "F:${row.documento} (${row.documentoFecha}) "
    }



    PolizaDet mapRow(String cuentaClave, row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        String descripcion = ""
        PolizaDet det = new PolizaDet(
                
        )

        return det
    }


    PolizaDet mapRow() {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        String descripcion = ""


        PolizaDet det = new PolizaDet(

        )

        return det
    }



}
