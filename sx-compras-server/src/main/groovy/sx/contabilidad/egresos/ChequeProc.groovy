package sx.contabilidad.egresos

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

import sx.contabilidad.Poliza
import sx.contabilidad.PolizaCreateCommand
import sx.contabilidad.ProcesadorMultipleDePolizas
import sx.tesoreria.MovimientoDeCuenta

import static sx.contabilidad.Mapeo.*


@Slf4j
@Component
class ChequeProc implements  ProcesadorMultipleDePolizas{


    @Override
    String definirConcepto(Poliza poliza) {
        return "Egreso Cheque"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        log.info('Generando Poliza de Eegresos tipo CHEQUE')
        poliza.partidas.clear()

        return poliza
    }

    @Override
    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        List<Poliza> polizas = []
        List<MovimientoDeCuenta> movimientos = MovimientoDeCuenta.where{fecha == command.fecha && cheque != null}.list()
        movimientos = movimientos.sort {it.cheque.folio}.reverse()
        movimientos.each{ mov ->

            Poliza p = Poliza.where{
                ejercicio == command.ejercicio &&
                mes == command.mes &&
                subtipo == command.subtipo &&
                tipo == command.tipo &&
                fecha == command.fecha &&
                egreso == mov.id
            }.find()

            if(p == null) {

                p = new Poliza(command.properties)
                p.concepto = "CH ${mov.referencia} ${mov.afavor} (${mov.fecha.format('dd/MM/yyyy')})"
                p.sucursal = mov.sucursal?: 'OFICINAS'
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)

        }
        return polizas
    }
}
