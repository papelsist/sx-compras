package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@Resource(readOnly = false, formats = ['json'], uri = "/api/embarques/prestamos/tasas")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@ToString(includes='fuente, tasa fecha', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes='fecha,fuente')
class FacturistaPrestamoTasa {

    Date fecha

    String fuente = 'CETES a 28 Dias'

    String moneda = 'MXN'
    
    BigDecimal tasa = 0.0
}
