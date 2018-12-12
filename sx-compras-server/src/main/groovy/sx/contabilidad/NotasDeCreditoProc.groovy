package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

@Slf4j
@Component
class NotasDeCreditoProc implements  ProcesadorDePoliza{

    String QUERY = """
    """

    @Override
    String definirConcepto(Poliza poliza) {
        return "Notas de credito"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        log.info('Procesando poliza {}  {} registros', poliza.tipo, poliza.subtipo)
        return poliza
    }

}
