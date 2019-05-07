package sx.contabilidad.ingresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaCreateCommand
import sx.contabilidad.ProcesadorMultipleDePolizas

@Slf4j
@Component
class CobranzaJurProc implements  ProcesadorMultipleDePolizas{

    @Autowired
    @Qualifier('cobranzaDepositosJurTask')
    CobranzaDepositosJurTask cobranzaDepositosJurTask

    @Autowired
    @Qualifier('cobranzaEfectivoJurTask')
    CobranzaEfectivoJurTask cobranzaEfectivoJurTask

    @Autowired
    @Qualifier('cobranzaSaldosAFavorTask')
    CobranzaSaldosAFavorTask cobranzaSaldosAFavorTask

    @Autowired
    @Qualifier('cobranzaPagosDiffTask')
    CobranzaPagosDiffTask cobranzaPagosDiffTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "COBRANZA JUR"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        cobranzaEfectivoJurTask.generarAsientos(poliza, [tipo: 'JUR'])
        cobranzaDepositosJurTask.generarAsientos(poliza, [tipo: 'JUR'])
        cobranzaSaldosAFavorTask.generarAsientos(poliza, [tipo: 'JUR'])
        cobranzaPagosDiffTask.generarAsientos(poliza, [tipo: 'JUR'])
        log.info('Partidas generadas: {}', poliza.partidas.size())
        return poliza
    }



    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        List<String> sucursals = ['OFICINAS']
        List<Poliza> polizas = []
        sucursals.each { suc ->
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
                p.concepto = "COBRANZA JURIDICO  ${suc}"
                p.fecha = command.fecha
                p.sucursal = suc
                log.info('Agregando poliza: {}', suc)
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)

        }
        return polizas
    }




}