package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

@Slf4j
@Component
class VentasCreProc extends VentasProc{

    @Override
    String getTipo() {
        return 'CRE'
    }

    String getTipoLabel() {
        return 'CREDITO'
    }
}
