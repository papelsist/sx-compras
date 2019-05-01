package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component


@Slf4j
@Component
class NotasDeCreditoBonProc extends NotasDeCreditoProc{

    String getTipo() {
        return 'NOTA_BON'
    }

    String getTipoLabel() {
        return 'BONIFICACIONES'
    }

    @Override
    String definirConcepto(Poliza poliza) {
        return "BONIFICACIONES DE CON, COD, CRE, CHE y JUR ${poliza.fecha.format('dd/MM/yyyy')}"
    }


}
