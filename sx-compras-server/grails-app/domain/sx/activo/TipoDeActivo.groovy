package sx.activo

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode
import sx.contabilidad.CuentaContable

@Resource(readOnly = false, formats = ['json'], uri = "/api/activo/tipoDeActivo")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes= "clave, nombre, tasa")
class TipoDeActivo {

    CuentaContable cuentaContable
    String clave
    String nombre
    BigDecimal tasa

}