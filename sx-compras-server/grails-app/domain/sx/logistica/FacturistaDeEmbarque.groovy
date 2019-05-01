package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@Resource(readOnly = false, formats = ['json'], uri = "/api/embarques/facturistas")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@ToString(excludes =  'id, version', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes=['id', 'nombre'])
class FacturistaDeEmbarque {

    String id

    String nombre

    String rfc

    String email

    String telefono

    Proveedor proveedor

    static constraints = {
        email nullable: true
        telefono nullable: true
    }

    static mapping= {
        id generator:'uuid'

    }

    String toString() {
        return "$nombre"
    }
}
