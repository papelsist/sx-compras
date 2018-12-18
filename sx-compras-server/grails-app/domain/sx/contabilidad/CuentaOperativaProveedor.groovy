package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@EqualsAndHashCode(includes='proveedor, cuentaOperativa')
@ToString(includes='proveedor, cuentaOperativa',includeNames=true,includePackage=false)
class CuentaOperativaProveedor {

    Proveedor proveedor
    String cuentaOperativa

    Date dateCreated
    Date lastUpdated
}
