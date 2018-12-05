package sx.contabilidad

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

@Slf4j
@CompileStatic
@Component
class CobranzaConProc implements  ProcesadorDePoliza {

    @Override
    String definirConcepto(Poliza poliza) {
        log.info('Definiendo concepo para la poliza de cobranza credito')
        return "COBRANZA CONTADO (${poliza.fecha.format('dd/MM/yyyy')})"
    }
}
