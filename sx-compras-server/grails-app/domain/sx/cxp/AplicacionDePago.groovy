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

    NotaDeCreditoCxP nota

    String cxp

    BigDecimal importe

    String comentario

    Date dateCreated

    Date lastUpdated

    static constraints = {
        comentario nullable:true
        nota nullable: true
    }

    static  mapping = {
        id generator:'uuid'
        fecha type: 'date'
    }
}
