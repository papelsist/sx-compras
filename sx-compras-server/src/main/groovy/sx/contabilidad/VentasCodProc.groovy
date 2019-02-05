package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

@Slf4j
@Component
class VentasCodProc extends VentasProc {

    @Override
    String getTipo() {
        return 'COD'
    }

    String getTipoLabel() {
        return 'COD'
    }
}
