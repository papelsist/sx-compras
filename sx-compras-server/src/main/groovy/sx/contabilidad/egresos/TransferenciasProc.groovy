package sx.contabilidad.egresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaCreateCommand
import sx.contabilidad.ProcesadorMultipleDePolizas
import sx.tesoreria.MovimientoDeCuenta
import sx.contabilidad.PolizaDet

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

    @Autowired
    @Qualifier('pagoDeCompraTask')
    PagoDeCompraTask pagoDeCompraTask

    @Autowired
    @Qualifier('devolucionClienteTask')
    DevolucionClienteTask devolucionClienteTask

    

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)

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

        ajustar(poliza,[:])
       

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

    def ajustar(Poliza p, Map params){
        
        BigDecimal debe = 0
        BigDecimal haber = 0

        p.partidas.each{
            
        }  

       

       BigDecimal dif = debe - haber

       log.info("Registrando Diferencias")

       def det = p.partidas.find{it.cuenta .clave.startsWith('600')}

       println debe +" "+haber+" "+dif

        if(dif >0 ){
           /*  PolizaDet pdet = new PolizaDet()
            pdet.cuenta = buscarCuenta('704-0005-0000-0000')
            pdet.sucursal = 'OFICINAS'
            pdet.origen = det.origen
            pdet.referencia = det.referencia
            pdet.referencia2 = det.referencia2
            pdet.haber = dif.abs()
            pdet.descripcion = det.descripcion
            pdet.entidad = det.entidad
            pdet.asiento = det.asiento
            pdet.documentoTipo = det.documentoTipo
            pdet.documentoFecha = det.documentoFecha
            pdet.documento = det.documento
            p.addToPartidas(pdet) */
       }
       if(dif < 0){
           /* PolizaDet pdet = new PolizaDet()
            pdet.cuenta = buscarCuenta('703-0001-0000-0000')
            pdet.sucursal = det.sucursal
            pdet.origen = det.origen
            pdet.referencia = det.referencia
            pdet.referencia2 = det.referencia2
            pdet.debe = dif.abs()
            pdet.descripcion = det.descripcion
            pdet.entidad = det.entidad
            pdet.asiento = det.asiento
            pdet.documentoTipo = det.documentoTipo
            pdet.documentoFecha = det.documentoFecha
            pdet.documento = det.documento */
          //  p.addToPartidas(pdet)
       } 

     }
    
}
