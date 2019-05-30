package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.contabilidad.CuentaContable

@Resource(readOnly = false, formats = ['json'], uri = "/api/productoSat/clases")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='clave')
@ToString(includeNames = true, includes = "clave, descripcion")
class ProductoSatClase {

    String clave

    String claveGrupo

    String claveSat

    String descripcion

    CuentaContable cuentaContable

    static constraints = {
        clave size: 2, unique: true
        claveSat size: 8
        claveGrupo size: 4
        cuentaContable nullable: true
    }

    static mapping = {
        clave index: 'PROD_SAT_CLASE_IDX1'
        claveGrupo index: 'PROD_SAT_CLASE_IDX2'
    }
}
