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
class CobranzaCreProc implements  ProcesadorMultipleDePolizas{

    @Autowired
    @Qualifier('cobranzaDepositosCreTask')
    CobranzaDepositosCreTask cobranzaDepositosCreTask

    @Autowired
    @Qualifier('cobranzaEfectivoCreTask')
    CobranzaEfectivoCreTask cobranzaEfectivoCreTask

    @Autowired
    @Qualifier('cobranzaSaldosAFavorTask')
    CobranzaSaldosAFavorTask cobranzaSaldosAFavorTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "COBRANZA CRE"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        cobranzaDepositosCreTask.generarAsientos(poliza, [tipo: 'CRE'])
        cobranzaEfectivoCreTask.generarAsientos(poliza, [tipo: 'CRE'])
        cobranzaSaldosAFavorTask.generarAsientos(poliza, [tipo: 'CRE'])
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
                p.concepto = "COBRANZA CRE  ${suc}"
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