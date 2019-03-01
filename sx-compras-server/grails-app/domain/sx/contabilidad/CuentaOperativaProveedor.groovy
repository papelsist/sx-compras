package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@EqualsAndHashCode(includes='proveedor, tipo, cuentaOperativa')
@ToString(includes='proveedor, tipo, cuentaOperativa',includeNames=true,includePackage=false)
class CuentaOperativaProveedor {

    Proveedor proveedor
    String cuentaOperativa
    String tipo

    Date dateCreated
    Date lastUpdated


    static constraints = {
        tipo nullable: true
    }
}
