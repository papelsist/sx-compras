package sx.activo

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.Resource
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@Resource(readOnly = false, formats = ['json'], uri = "/api/activo/inpc")
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@EqualsAndHashCode(includes='ejercicio, mes')
@ToString(includeFields = true, excludes = ['dateCreated', 'lastUpdated'])
class Inpc {

    Integer ejercicio
    Integer mes
    BigDecimal tasa

    Date dateCreated
    Date lastUpdated

    static constraints = {
    }
}
