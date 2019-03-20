package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@Resource(readOnly = false, formats = ['json'], uri = "/api/choferes")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@ToString(excludes =  'id, version', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes=['id', 'nombre'])
class Chofer {

    String id

    String nombre

    String rfc

    String celular

    String mail

    String sw2

    FacturistaDeEmbarque facturista

    BigDecimal comision = 0.0

    BigDecimal precioTonelada = 70.00

    Date dateCreated
    Date lastUpdated

    String createdBy
    String lastUpdatedBy

    static constraints = {
        mail nullable: true
        celular nullable: true
        rfc nullable: true
        dateCreated nullable: true
        lastUpdated nullable: true
        createdBy nullable: true
        lastUpdatedBy nullable: true
        facturista nullable: true
        comision nullable: true
        sw2 nullable: true
    }

    static  mapping={
        id generator:'uuid'
    }
}
