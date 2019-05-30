package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@Resource(readOnly = false, formats = ['json'], uri = "/api/productoSat/divisiones")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='clave')
@ToString(includeNames = true, includes = "clave, descripcion")
class ProductoSatDivision {

    String clave

    String claveSat

    String descripcion

    static constraints = {
        clave size: 2, unique: true
        claveSat size: 8
    }

    static mapping = {
        clave index: 'PROD_SAT_DIV_IDX1'
    }

}
