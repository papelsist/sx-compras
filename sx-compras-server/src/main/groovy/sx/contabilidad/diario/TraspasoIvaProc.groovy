package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*

@Slf4j
@Component
class TraspasoIvaProc implements  ProcesadorDePoliza, AsientoBuilder{

 

    @Override
    String definirConcepto(Poliza poliza) {
        return "Traspaso De Iva ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {

    }

    String generarDescripcion(Map row ) {
        return ""
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
                entidad: 'Tesoreria',
                documento: row.documento,
                documentoTipo: 'FAC',
                documentoFecha: row.fecha_doc,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        ) 
        return det
    }

}
 