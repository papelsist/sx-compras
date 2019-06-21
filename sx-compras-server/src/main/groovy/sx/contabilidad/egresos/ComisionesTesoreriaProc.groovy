package sx.contabilidad.egresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*
import sx.contabilidad.diario.*

@Slf4j
@Component
class ComisionesTesoreriaProc implements  ProcesadorDePoliza{


    @Autowired
    @Qualifier('comisionBancariaTask')
    ComisionBancariaTask comisionBancariaTask


    @Override
    String definirConcepto(Poliza poliza) {
        return "Tesoreria ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        comisionBancariaTask.generarAsientos(poliza, [:])
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

}
 