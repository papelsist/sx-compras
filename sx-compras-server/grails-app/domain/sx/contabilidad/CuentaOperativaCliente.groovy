package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Cliente

@EqualsAndHashCode(includes='cliente, cuentaOperativa')
@ToString(includes='cliente, cuentaOperativa',includeNames=true,includePackage=false)
class CuentaOperativaCliente {

    Cliente cliente
    String cuentaOperativa

    Date dateCreated
    Date lastUpdated
}
