package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.contabilidad.*

@Slf4j
@Component
class ComisionesBancariaGastoProc implements  ProcesadorDePoliza, AsientoBuilder{


    @Override
    String definirConcepto(Poliza poliza) {
        return "${poliza.concepto} (${poliza.fecha.format('dd/MM/yyyy')})"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.manual = true
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
        return poliza
    }


}
