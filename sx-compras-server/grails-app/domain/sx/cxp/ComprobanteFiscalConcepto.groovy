package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includes = 'id', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = 'id')
class ComprobanteFiscalConcepto {

    String id

    String claveProdServ

    String claveUnidad

    String unidad

    String descripcion

    BigDecimal cantidad

    BigDecimal valorUnitario

    BigDecimal importe

    BigDecimal descuento = 0.0

    BigDecimal isrRetenido = 0.0
    BigDecimal isrRetenidoTasa = 0.0
    BigDecimal ivaRetenido = 0.0
    BigDecimal ivaRetenidoTasa = 0.0
    BigDecimal ivaTrasladado = 0.0
    BigDecimal ivaTrasladadoTasa = 0.0

    List<ConceptoDeGasto> conceptos = []

    static belongsTo = [comprobante: ComprobanteFiscal]

    static hasMany = [conceptos: ConceptoDeGasto]

    static constraints = {
        claveProdServ nullable: true
        claveUnidad nullable: true
        unidad nullable: true
        descripcion nullable: true
        cantidad nullable: true
        valorUnitario nullable: true
        importe nullable: true
        descuento nullable: true
    }

    static mapping = {
        id generator: 'uuid'
        conceptos cascade: "all-delete-orphan"
    }

}
