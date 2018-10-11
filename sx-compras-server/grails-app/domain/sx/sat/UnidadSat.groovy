package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode

@Resource(readOnly = false, formats = ['json'], uri = "/api/unidadSat")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='claveUnidadSat')
class UnidadSat {

    String unidadSat
    String claveUnidadSat


    static constraints = {
        unidadSat nullable: true
        claveUnidadSat nullable:true
    }

    String toString(){
        return "${claveUnidadSat} - ${claveUnidadSat}"
    }
}
