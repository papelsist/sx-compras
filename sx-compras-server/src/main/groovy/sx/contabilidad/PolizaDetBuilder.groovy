package sx.contabilidad

import groovy.transform.builder.Builder
import groovy.transform.builder.ExternalStrategy
import sx.contabilidad.CuentaContable
import sx.contabilidad.PolizaDet

@Builder(builderStrategy = ExternalStrategy, forClass = PolizaDet)
class PolizaDetBuilder {


    CuentaContable buscarCuenta(String clave) {
        CuentaContable cuenta = CuentaContable.where{clave == clave}.find()
        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable ${clave}")
        return cuenta
    }
}
