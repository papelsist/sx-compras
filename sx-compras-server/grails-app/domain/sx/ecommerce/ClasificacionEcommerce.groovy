package sx.ecommerce

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode
import sx.sat.ProductoSat
import sx.sat.UnidadSat
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode

@Resource(readOnly = false, formats = ['json'], uri = "/api/clasificacionesEcommerce")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@ToString(includes='id,nombre',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id')
class ClasificacionEcommerce {

    String nombre

    String imagen

    String descripcion

    String uso


    static constraints = {
        imagen nullable: true
        descripcion nullable: true
        uso: true
    }

    static mapping={
    
    }


}
