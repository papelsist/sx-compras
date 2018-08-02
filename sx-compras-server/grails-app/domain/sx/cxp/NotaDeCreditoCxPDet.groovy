package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(excludes =  ['version','lastUpdated', 'dateCreated'], includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'cxp', 'foexitlio', 'serie'])
@GrailsCompileStatic
class NotaDeCreditoCxPDet {

    String id

    CuentaPorPagar	cxp

    String uuid

    String folio

    String serie

    Date fechaDocumento

    BigDecimal totalDocumento = 0.0

    BigDecimal saldoDocumento = 0.0

    BigDecimal importe

    String comentario

    static constraints = {
        comentario nullable:true
        cxp nullable: true
        fechaDocumento nullable: true
    }

    static mapping={
        id generator:'uuid'
        fechaDocumento type: 'date'
    }

    static belongsTo =[nota:NotaDeCreditoCxP]
}
