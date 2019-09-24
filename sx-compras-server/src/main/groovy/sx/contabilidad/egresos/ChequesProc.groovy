package sx.contabilidad.egresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.Poliza
import sx.contabilidad.PolizaCreateCommand
import sx.contabilidad.ProcesadorMultipleDePolizas
import sx.tesoreria.Cheque
import sx.tesoreria.MovimientoDeCuenta

/**
 * Procesador para la generacion de polizas de Egreso tipo
 * Cheque, es decir Pagos con CHEQUE
 *
 */
@Slf4j
@Component
class ChequesProc implements  ProcesadorMultipleDePolizas {


    @Autowired
    @Qualifier('pagoNominaTask')
    PagoNominaTask pagoNominaTask

    @Autowired
    @Qualifier('pagoGastosReqTask')
    PagoGastosReqTask pagoGastosReqTask

    @Autowired
    @Qualifier('pagoGastosTask')
    PagoGastosTask pagoGastosTask

    @Autowired
    @Qualifier('pagoDeCompraTask')
    PagoDeCompraTask pagoDeCompraTask

    @Autowired
    @Qualifier('devolucionClienteTask')
    DevolucionClienteTask devolucionClienteTask

    @Autowired
    @Qualifier('chequeCanceladoTask')
    ChequeCanceladoTask chequeCanceladoTask


    @Override
    String definirConcepto(Poliza poliza) {
        return ""
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        if(egreso) {
            log.info("Generando poliza de egreso: {} Id:{}", egreso.tipo, poliza.egreso)
            switch (egreso.tipo) {
                case 'COMPRA':
                    pagoDeCompraTask.generarAsientos(poliza, [:])
                    break
                case 'PAGO_NOMINA':
                    pagoNominaTask.generarAsientos(poliza, [:])
                    break
                case 'GASTO' :
                    pagoGastosReqTask.generarAsientos(poliza, [:])
                    break
                case 'REMBOLSO':
                    pagoGastosTask.generarAsientos(poliza,[:])
                    break
                case 'DEVOLUCION_CLIENTE':
                    devolucionClienteTask.generarAsientos(poliza, [:])
                    break
            }
        } else {
             chequeCanceladoTask.generarAsientos(poliza, [:])
        }

        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }



    @Override
    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        List<Poliza> polizas = []

        List<MovimientoDeCuenta> movimientos = MovimientoDeCuenta.where{fecha == command.fecha && formaDePago == 'CHEQUE' && cheque !=null}
                .list([sort: 'fecha', order: 'asc'])

        movimientos.addAll(buscarChequesCancelados(command.fecha))

        movimientos = movimientos.sort {it.cheque.folio}

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
                p.concepto = "CH ${mov.referencia} ${mov.afavor} (${mov.fecha.format('dd/MM/yyyy')})" +
                        " (${mov.tipo} ${mov.tipo != mov.concepto ? mov.concepto : ''})"
                p.sucursal = mov.sucursal?: 'OFICINAS'
                p.egreso = "${mov.id}"
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)

        }
        return polizas
    }

    List<MovimientoDeCuenta> buscarChequesCancelados(Date fecha){
        List<Cheque> cancelados = Cheque
                .findAll(
                "from Cheque c where c.fecha = ?  and c.cancelado != null",
                [fecha])
        List<MovimientoDeCuenta> res = []
        cancelados.each {
            MovimientoDeCuenta mv = new MovimientoDeCuenta()
            mv.id = it.id
            mv.cuenta = it.cuenta
            mv.fecha = it.fecha
            mv.referencia = it.folio.toString()
            mv.comentario = it.nombre
            mv.afavor = it.nombre
            mv.cheque = it
            mv.formaDePago = 'CHEQUE'
            mv.tipo = 'CHE_CANCELADO'
            mv.sucursal = 'OFICINAS'
            mv.importe = 0.0
            mv.conceptoReporte = "CHEQUE CANCELADO: ${it.folio}"
            mv.concepto = 'CHE_CANCELADO'
            mv.dateCreated = it.dateCreated
            mv.lastUpdated = it.lastUpdated
            mv.createUser = it.createUser
            mv.updateUser = it.updateUser
            res << mv
        }
        return res
    }


}
