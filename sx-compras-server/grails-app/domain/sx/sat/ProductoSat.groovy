package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode

@Resource(readOnly = false, formats = ['json'], uri = "/api/productoSat")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='claveProdServ')
class ProductoSat {

    String claveProdServ
    String descripcion

    static constraints = {
        claveProdServ unique:true
        descripcion maxSie:255
    }

    String toString(){
        return "${claveProdServ} - ${descripcion}"
    }

}