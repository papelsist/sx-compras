package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cxp.CuentaPorPagar

@ToString(excludes ='id,version,dateCreated,lastUpdated,requisicion',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, cxp')
class RequisicionDet {

    String id

    CuentaPorPagar cxp

    BigDecimal total = 0.0

    BigDecimal descuentof = 0.0

    BigDecimal descuentofImporte = 0.0

    BigDecimal apagar = 0.0


    String documentoSerie
    String documentoFolio
    Date documentoFecha
    BigDecimal documentoTotal
    String uuid
    String acuse

    String comentario

    Date dateCreated

    Date lastUpdated

    static belongsTo = [requisicion:Requisicion]

    static constraints = {
        comentario nullable:true
        cxp nullable: true
        documentoFecha nullable:true
        documentoFolio nullable:true
        documentoSerie nullable:true
        documentoTotal nullable:true
        uuid nullable: true
        acuse nullable: true
    }

    static mapping ={
        id generator:'uuid'

    }

}
