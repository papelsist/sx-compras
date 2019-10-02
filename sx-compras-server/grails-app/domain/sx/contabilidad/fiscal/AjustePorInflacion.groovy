package sx.contabilidad.fiscal

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.contabilidad.CuentaContable

@EqualsAndHashCode(includes = 'cuenta, concepto, tipo, grupo')
@ToString(includes='cuenta, concepto, tipo, grupo',includeNames=true,includePackage=false)
class AjustePorInflacionConcepto {

    CuentaContable cuenta
    String concepto
    String tipo
    String grupo

    Boolean activo = true

    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated


    static constraints = {
        cuenta nullable: true
        tipo maxSixe: 30
        grupo maxSize: 30
        createUser nullable: true
        updateUser nullable: true
    }
}