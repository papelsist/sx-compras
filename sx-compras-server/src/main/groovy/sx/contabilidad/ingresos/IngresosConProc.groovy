package sx.contabilidad.ingresos

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*

@Slf4j
@Component
class IngresosConProc implements  ProcesadorDePoliza{

    @Autowired
    @Qualifier('ingresosFichasTask')
    IngresosFichasTask ingresosFichasTask

    @Autowired
    @Qualifier('cobranzaSaldosAFavorTask')
    CobranzaSaldosAFavorTask cobranzaSaldosAFavorTask

    @Autowired
    @Qualifier('cobranzaDepositosTask')
    CobranzaDepositosTask cobranzaDepositosTask

    @Override
    String definirConcepto(Poliza poliza) {
        return "Ingresos Contado ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        println poliza
        poliza.partidas.clear()
        ingresosFichasTask.generarAsientos(poliza)
        cobranzaSaldosAFavorTask.generarAsientosIngresos(poliza, [tipo: 'CON'])
        cobranzaDepositosTask.generarAsientosIngresos(poliza)
        poliza = poliza.save flush: true, failOnError:true
        return poliza
    }

}
