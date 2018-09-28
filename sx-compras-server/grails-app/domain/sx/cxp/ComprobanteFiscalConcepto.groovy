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

    static belongsTo = [comprobante: ComprobanteFiscal]

    static constraints = {
        claveProdServ nullable: true
        claveUnidad nullable: true
        unidad nullable: true
        descripcion nullable: true
        cantidad nullable: true
        valorUnitario nullable: true
        importe nullable: true
    }

    static mapping = {
        id generator: 'uuid'
    }
}
