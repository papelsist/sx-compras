package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@Resource(readOnly = false, formats = ['json'], uri = "/api/productoSat/grupos")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='clave')
@ToString(includeNames = true, includes = "clave, descripcion")
class ProductoSatGrupo {

    String clave

    String claveDivision

    String claveSat

    String descripcion

    static constraints = {
        clave size: 2, unique: true
        claveSat size: 8
        claveDivision size: 2
    }

    static mapping = {
        clave index: 'PROD_SAT_GPO_IDX1'
        claveDivision index: 'PROD_SAT_GPO_IDX2'
    }
}
