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
class CobranzaCodProc implements  ProcesadorMultipleDePolizas{

    @Autowired
    @Qualifier('cobranzaDepositosCodTask')
    CobranzaDepositosCodTask cobranzaDepositosCodTask

    @Autowired
    @Qualifier('cobranzaEfectivoCodTask')
    CobranzaEfectivoCodTask cobranzaEfectivoCodTask

    @Autowired
    @Qualifier('cobranzaSaldosAFavorTask')
    CobranzaSaldosAFavorTask cobranzaSaldosAFavorTask

    @Autowired
    @Qualifier('cobranzaPagosDiffTask')
    CobranzaPagosDiffTask cobranzaPagosDiffTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "COBRANZA COD"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        cobranzaEfectivoCodTask.generarAsientos(poliza, [tipo: 'COD'])
        cobranzaDepositosCodTask.generarAsientos(poliza, [tipo: 'COD'])
        cobranzaSaldosAFavorTask.generarAsientos(poliza, [tipo: 'COD'])
        cobranzaPagosDiffTask.generarAsientos(poliza, [tipo: 'COD'])
        log.info('Partidas generadas: {}', poliza.partidas.size())
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
                p.concepto = "COBRANZA COD  ${it.nombre}"
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