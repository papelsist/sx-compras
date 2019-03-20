package sx.logistica

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@GrailsCompileStatic
@ToString(includes='fecha, importe, comentario', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = 'id, fecha, importe, comentario ')
class OtroCargoChoferDet {

    String comentario

    Date fecha

    BigDecimal importe

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static belongsTo = [otroCargoChofer: OtroCargoChofer]

    static constraints = {
        comentario nullable: true
    }

    static  mapping = {
        fecha type: 'date'
    }
}
