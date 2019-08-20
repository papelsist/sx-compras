package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.contabilidad.*

@Slf4j
@Component
class InventariosProc implements  ProcesadorDePoliza, AsientoBuilder{

    @Autowired
    @Qualifier('inventariosProcGeneralesTask')
    InventariosProcGeneralesTask inventariosProcGeneralesTask

    @Autowired
    @Qualifier('inventariosProcRedondeoTask')
    InventariosProcRedondeoTask inventariosProcRedondeoTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "DESCUENTOS EN  COMPRAS ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
        inventariosProcGeneralesTask.generarAsientos(poliza, [:])
        inventariosProcRedondeoTask.generarAsientos(poliza, [:])
        BigDecimal cuadre = poliza.partidas.sum{it.debe} - poliza.partidas.sum{it.haber}
        log.info("Cuadre: {}", cuadre)

        if(cuadre.abs() > 0) {

            PolizaDet found = poliza.partidas.find{it.cuenta.clave == '115-0001-0010-0000' && it.asiento == 'REDONDEO'}
            PolizaDet next = new PolizaDet()
            next.properties = found.properties
            next.descripcion = "DIFERENCIA ${next.descripcion}"
            next.debe = 0.0
            next.haber = 0.0
            poliza.addToPartidas(next)
            def cuentaStr=''
            if(cuadre < 0){
                cuentaStr ='703-0001-0000-0000'
                next.debe = cuadre.abs()
               
            }else{
                cuentaStr = '704-0005-0000-0000'
                next.haber = cuadre.abs()
            }
            CuentaContable cuenta = buscarCuenta(cuentaStr)
            next.cuenta = cuenta

        }
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }



    String generarDescripcion(Map row) {
        if(row.tc > 1.0) {
            return "NC:${row.folio} F: ${row.documento} (${row.fecha_documento}) T.C. ${row.tc}"
        }
        return "NC:${row.folio} F: ${row.documento} (${row.fecha_documento}) "
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
                entidad: 'CuentaPorPagar',
                documento: row.documento,
                documentoTipo: 'FAC',
                documentoFecha: row.fecha_documento,
                sucursal: 'OFICINAS',
                debe: debe.abs(),
                haber: haber.abs()
        )
        // Datos del complemento
        // asignarComprobanteNacional(det, row)
        return det
    }


}
