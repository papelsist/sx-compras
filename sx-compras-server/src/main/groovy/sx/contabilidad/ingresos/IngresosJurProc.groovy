package sx.contabilidad.ingresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*

@Slf4j
@Component
class IngresosJurProc implements  ProcesadorDePoliza{

   @Autowired
    @Qualifier('ingresosTask')
    IngresosTask ingresosTask

    @Autowired
    @Qualifier('traspasosCxcTask')
    TraspasosCxcTask  traspasosCxcTask 


    @Override
    String definirConcepto(Poliza poliza) {
        return "Ingresos JUR ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        println poliza
        poliza.partidas.clear()
        ingresosTask.generarAsientos(poliza, [tipo: 'JUR'])
        traspasosCxcTask.generarAsientos(poliza, [tipo: 'JUR'])
        poliza = poliza.save flush: true, failOnError:true
        return poliza
    }

}
