package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@GrailsCompileStatic
@ToString(excludes = ['version','lastUpdated', 'dateCreated'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'tipo','cxp'])
class AplicacionDePago {

    String id

    Date fecha

    String tipo

    String cxp

    BigDecimal importe

    String comentario

    String sw2

    Date dateCreated

    Date lastUpdated

    static constraints = {
        comentario nullable:true
        sw2 nullable: true
    }

    static  mapping={
        id generator:'uuid'
    }
}
