package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

@Slf4j
@Component
class VentasAcfProc extends VentasProc {

    @Override
    String getTipo() {
        return 'ACF'
    }

    String getTipoLabel() {
        return 'ACF'
    }

          @Override
    Poliza recalcular(Poliza poliza) {
      
        poliza.partidas.clear()

        String select = QUERY.replaceAll('@FECHA', toSqlDate(poliza.fecha))
        List rows = getAllRows(select, [])
        
        rows = rows.findAll {it.documentoTipo == this.getTipo()}
        log.info('Actualizando poliza {} procesando {} registros', poliza.id, rows.size())
        rows.each { row ->

            if(!row.uuid) {
                throw new RuntimeException("Venta facturada ${row.documento} sin UUID. No se puede generar el complemento CompNac(SAT)")
            }
    
            cargoClientes(poliza, row)
            abonoVentas(poliza, row)
            abonoIvaNoTrasladado(poliza, row)
        }
        // ajustarConceptos(poliza)
        return poliza
    }

    
}
