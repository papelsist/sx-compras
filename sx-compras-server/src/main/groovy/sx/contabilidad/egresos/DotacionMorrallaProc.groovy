package sx.contabilidad.egresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*
import sx.contabilidad.diario.*

@Slf4j
@Component
class DotacionMorrallaProc implements  ProcesadorDePoliza{

    @Autowired
    @Qualifier('morrallaTask')
    MorrallaTask morrallaTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "Tesoreria ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()

        morrallaTask.generarAsientos(poliza, [:])

        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

}
 