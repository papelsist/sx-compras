package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(excludes = ['id,version,sw2,dateCreated,lastUpdated'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id, com, '])
class AnalisisDeFacturaDet {

    String id

    // RecepcionDeCompraDet entrada
    String com

    BigDecimal cantidad = 0.0

    BigDecimal precioDeLista = 0.0

    BigDecimal desc1 = 0.0

    BigDecimal desc2 = 0.0

    BigDecimal desc3 = 0.0

    BigDecimal desc4 = 0.0

    BigDecimal costoUnitario = 0.0

    BigDecimal importe = 0.0

    Long sw2

    Date dateCreated
    Date lastUpdated

    static belongsTo = [analisis: AnalisisDeFactura]

    static constraints = {
        precioDeLista scale:2
        desc1 scale:4
        desc2 scale:4
        desc3 scale:4
        desc4 scale:4
        costoUnitario scale:6
        com unique: true
        sw2 nullable:true
    }

    static mapping = {
        id generator:'uuid'
        com type:'date' ,index: 'ANALISISDET_IDX1'
    }
}
