package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*

@Slf4j
@Component
class TraspasoEInversionesProc implements  ProcesadorDePoliza{

    @Autowired
    @Qualifier('traspasoTask')
    TraspasoTask traspasoTask

    @Autowired
    @Qualifier('inversionTask')
    InversionTask inversionTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "Traspaso E Inversiones ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        traspasoTask.generarAsientos(poliza, [:])
        inversionTask.generarAsientos(poliza, [:])
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

}
 