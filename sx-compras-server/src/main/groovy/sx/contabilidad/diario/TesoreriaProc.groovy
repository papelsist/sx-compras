package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*

@Slf4j
@Component
class TesoreriaProc implements  ProcesadorDePoliza{

    @Autowired
    @Qualifier('traspasoTask')
    TraspasoTask traspasoTask

    @Autowired
    @Qualifier('comisionBancariaTask')
    ComisionBancariaTask comisionBancariaTask

    @Autowired
    @Qualifier('morrallaTask')
    MorrallaTask morrallaTask

    @Autowired
    @Qualifier('inversionTask')
    InversionTask inversionTask

    @Autowired
    @Qualifier('movimientoTesoreriaTask')
    MovimientoTesoreriaTask movimientoTesoreriaTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "Tesoreria ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        //traspasoTask.generarAsientos(poliza, [:])
        //comisionBancariaTask.generarAsientos(poliza, [:])
        //morrallaTask.generarAsientos(poliza, [:])
        //inversionTask.generarAsientos(poliza, [:])
        movimientoTesoreriaTask.generarAsientos(poliza, [:])
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

}
 