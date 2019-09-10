package sx.contabilidad.egresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaCreateCommand
import sx.contabilidad.ProcesadorMultipleDePolizas
import sx.tesoreria.MovimientoDeCuenta

/**
 * Procesador para la generacion de polizas de Egreso tipo
 * Transferencia
 *
 */
@Slf4j
@Component
class TransferenciasProc implements  ProcesadorMultipleDePolizas {

    @Autowired
    @Qualifier('pagoGastosTask')
    PagoGastosTask pagoGastosTask

    @Autowired
    @Qualifier('pagoNominaTask')
    PagoNominaTask pagoNominaTask

    @Autowired
    @Qualifier('pagoGastosReqTask')
    PagoGastosReqTask pagoGastosReqTask

    

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)

        log.info("Generando poliza de egreso: {} Id:{}", egreso.tipo, poliza.egreso)
        switch (egreso.tipo) {

            case 'PAGO_NOMINA':
                pagoNominaTask.generarAsientos(poliza, [:])
                break
            case 'GASTO' :
                pagoGastosReqTask.generarAsientos(poliza, [:])
                break
            case 'REMBOLSO':
                pagoGastosTask.generarAsientos(poliza,[:])
                break
        }

        poliza = poliza.save failOnError: true, flush: true
        poliza.refresh()
        return poliza
    }



    @Override
    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        List<Poliza> polizas = []
        List<MovimientoDeCuenta> movimientos = MovimientoDeCuenta
                .where{fecha == command.fecha && formaDePago ==  'TRANSFERENCIA' && importe < 0.0}
                .where{tipo in ['COMPRA','GASTO','REMBOLSO','PAGO_NOMINA'] && concepto != 'COMISION_POR_TRANSFERENCIA'}
                .list([sort: 'fecha', order: 'asc'])
        movimientos = movimientos.sort {it.cuenta.descripcion}
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
                p.concepto = "TR: ${mov.referencia} ${mov.afavor} (${mov.fecha.format('dd/MM/yyyy')}) (${mov.tipo})"
                p.sucursal = mov.sucursal?: 'OFICINAS'
                p.egreso = mov.id
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)

        }
        return polizas
    }

    
}
