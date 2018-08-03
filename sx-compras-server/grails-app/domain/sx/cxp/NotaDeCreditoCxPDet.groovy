package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includes =  ['uuid'], includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'cxp', 'foexitlio', 'serie'])
@GrailsCompileStatic
class NotaDeCreditoCxPDet {

    String id

    String uuid

    CuentaPorPagar	cxp

    String folio

    String serie

    Date fechaDocumento

    BigDecimal totalDocumento

    BigDecimal saldoDocumento

    BigDecimal importe

    String comentario

    static constraints = {
        comentario nullable:true
        cxp nullable: true
        folio nullable: true
        serie nullable: true
        fechaDocumento nullable: true
        totalDocumento nullable: true
        saldoDocumento nullable: true
        importe nullable: true
        comentario nullable: true
    }

    static mapping={
        id generator:'uuid'
        fechaDocumento type: 'date'
    }

    static belongsTo =[nota:NotaDeCreditoCxP]
}
