package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cxp.CuentaPorPagar

@ToString(excludes ='id,version,dateCreated,lastUpdated,requisicion',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, cxp')
class RequisicionDet {

    String id

    CuentaPorPagar cxp

    BigDecimal importe = 0.0

    String comentario

    Date dateCreated

    Date lastUpdated

    static belongsTo = [requisicion:Requisicion]

    static constraints = {
        comentario nullable:true
        cxp nullable: true
    }

    static mapping ={
        id generator:'uuid'

    }

}
