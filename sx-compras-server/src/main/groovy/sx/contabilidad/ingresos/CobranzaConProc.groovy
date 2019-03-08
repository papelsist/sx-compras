package sx.contabilidad.ingresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaCreateCommand
import sx.contabilidad.ProcesadorMultipleDePolizas
import sx.core.Sucursal

@Slf4j
@Component
class CobranzaConProc implements  ProcesadorMultipleDePolizas{

    @Autowired
    @Qualifier('cobranzaDepositosTask')
    CobranzaDepositosTask cobranzaDepositosTask

    @Autowired
    @Qualifier('cobranzaEfectivoTask')
    CobranzaEfectivoTask cobranzaEfectivoTask

    @Autowired
    @Qualifier('cobranzaTarjetaTask')
    CobranzaTarjetaTask cobranzaTarjetaTask

    @Autowired
    @Qualifier('cobranzaSaldosAFavorTask')
    CobranzaSaldosAFavorTask cobranzaSaldosAFavorTask

    @Autowired
    @Qualifier('cobranzaPagosDiffTask')
    CobranzaPagosDiffTask cobranzaPagosDiffTask


    @Override
    String definirConcepto(Poliza poliza) {
        return "COBRANZA CONTADO"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        log.info('Procesando poliza de Cobransa CONTADO {} {}', poliza.sucursal, poliza.fecha)
        poliza.partidas.clear()
        cobranzaEfectivoTask.generarAsientos(poliza, [tipo: 'CON'])
        cobranzaDepositosTask.generarAsientos(poliza, [tipo: 'CON'])
        cobranzaTarjetaTask.generarAsientos(poliza, [tipo: 'CON'])
        cobranzaSaldosAFavorTask.generarAsientos(poliza, [tipo: 'CON'])
        cobranzaPagosDiffTask.generarAsientos(poliza, [tipo: 'CON'])
        log.info("Poliza finalizada")
        return poliza
    }



    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        List<Sucursal> sucursals = getSucursales()
        List<Poliza> polizas = []
        sucursals.each {
            String suc = it.nombre
            Poliza p = Poliza.where{
                ejercicio == command.ejercicio &&
                        mes == command.mes &&
                        subtipo == command.subtipo &&
                        tipo == command.tipo &&
                        fecha == command.fecha &&
                        sucursal == suc
            }.find()

            if(p == null) {

                p = new Poliza(ejercicio: command.ejercicio, mes: command.mes, subtipo: command.subtipo, tipo: command.tipo)
                p.concepto = "COBRANZA CONTADO  ${it.nombre}"
                p.fecha = command.fecha
                p.sucursal = it.nombre
                log.info('Agregando poliza: {}', it)
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)

        }
        return polizas
    }




}