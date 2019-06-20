package sx.activo

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.EqualsAndHashCode
import sx.contabilidad.CuentaContable

@Resource(readOnly = false, formats = ['json'], uri = "/api/tipoDeActivo")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='claveProdServ')
class TipoDeActivo {

    CuentaContable cuentaContable
    String nombre
    BigDecimal tasa

}