package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component


@Slf4j
@Component
class NotasDeCreditoDevProc  extends NotasDeCreditoProc{

    String getTipo() {
        return 'NOTA_DEV'
    }

    String getTipoLabel() {
        return 'DEVOLUCIONES DE CONTADO, COD y CREDITO'
    }

    @Override
    String definirConcepto(Poliza poliza) {
        return "DEVOLUCIONES DE CON, COD y CRE ${poliza.fecha.format('dd/MM/yyyy')}"
    }
}
