package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='clave')
@ToString(includes = 'cuenta, deudor, subtipo', includeNames=true,includePackage=false)
class CuentaDeudoraMapeo {

    /**
     * Cuenta contable
     *
     */
    CuentaContable cuenta

    /**
     * Nombre y/o RFC del deudor
     */
    String deudor

    /**
     * Contexto en el que se ocupa este mapeo
     *
     */
    String contexto

    static constraints = {
        cuenta unique: ['deudor', 'contexto']
    }
}
