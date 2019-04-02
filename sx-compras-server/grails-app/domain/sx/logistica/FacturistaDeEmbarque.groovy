package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@Resource(readOnly = false, formats = ['json'], uri = "/api/embarque/facturistas")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@ToString(excludes =  'id, version', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes=['id', 'nombre'])
class FacturistaDeEmbarque {

    String id

    String nombre

    String rfc

    String telefono

    String email

    String cuentaOperativa

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser


    static constraints = {
        createUser nullable: true
        updateUser nullable: true
    }

    static mapping= {
        id generator:'uuid'
        rfc minSize: 12, maxSize: 13
        telefono nullbale: true
        cuentaOperativa nullable: true
    }

    String toString() {
        return "$nombre"
    }
}
