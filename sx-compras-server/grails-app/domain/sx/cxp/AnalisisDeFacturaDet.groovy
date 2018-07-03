package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.compras.RecepcionDeCompraDet

@ToString(includes = 'clave, descripcion, cantdad, importe',includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'com'])
class AnalisisDeFacturaDet {

    String id

    String clave

    String descripcion

    String unidad

    RecepcionDeCompraDet com

    String remision

    Long folioCom

    String sucursal

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
        clave maxSize:15
        precioDeLista scale:2
        unidad nullable: true, maxSize: 5
        desc1 scale:4
        desc2 scale:4
        desc3 scale:4
        desc4 scale:4
        costoUnitario scale:6
        remision maxSize: 20
        sucursal maxSize: 20
        // com unique: true
        sw2 nullable:true
    }

    static mapping = {
        id generator:'uuid'
    }

    def beforeValidate() {
        if(com) {
            clave = com.producto.clave
            descripcion = com.producto.descripcion
        }
    }

}
