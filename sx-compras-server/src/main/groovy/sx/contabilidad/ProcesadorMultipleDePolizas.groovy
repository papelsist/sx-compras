package sx.contabilidad

import groovy.util.logging.Slf4j
import sx.core.Sucursal

@Slf4j
trait ProcesadorMultipleDePolizas extends ProcesadorDePoliza{

    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        return []
    }

    List<Sucursal> getSucursales() {
        List<Sucursal> sucursals = Sucursal.list().findAll { ['10','12','5','3','13'].contains(it.clave)}
        return sucursals
    }
}
