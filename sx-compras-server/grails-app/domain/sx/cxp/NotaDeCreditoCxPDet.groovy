package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includes =  ['uuid'], includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['uuid'])
@GrailsCompileStatic
class NotaDeCreditoCxPDet {

    String id

    String uuid

    CuentaPorPagar	cxp

    String comentario

    static constraints = {
        comentario nullable:true
        cxp nullable: true
        comentario nullable: true
    }

    static mapping={
        id generator:'uuid'
    }

    static belongsTo =[nota:NotaDeCreditoCxP]
}
