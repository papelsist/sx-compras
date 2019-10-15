package sx.contabilidad.fiscal

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import grails.rest.*
import grails.plugin.springsecurity.annotation.Secured

import sx.contabilidad.CuentaContable

@Resource(readOnly = false, formats = ['json'], uri = "/api/ajustePorInflacionConcepto")
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes = 'id, concepto')
@ToString(includes='cuenta, concepto, tipo, grupo',includeNames=true,includePackage=false)
class AjustePorInflacionConcepto {

    CuentaContable cuenta

    String clave

    String concepto

    String tipo

    String grupo

    Boolean activo = true

    Integer orden = 0

    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated


    static constraints = {
        cuenta nullable: true
        tipo inList: ['ACTIVO', 'PASIVO']
        grupo maxSize: 50
        concepto unique: ['tipo', 'grupo']
        createUser nullable: true
        updateUser nullable: true
        clave nullable: true
    }

    def beforeValidate() {
        if(cuenta && clave == null) {
            this.clave = cuenta.clave
        }
    }
}