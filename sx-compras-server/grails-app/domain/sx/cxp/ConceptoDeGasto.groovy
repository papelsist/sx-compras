package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.contabilidad.CuentaContable
import sx.core.Sucursal

/**
 *
 *
 */
@ToString(includes = ['productoServicio, cantidad, importe'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id'])
class ConceptoDeGasto {

    CuentaContable cuentaContable

    Sucursal sucursal

    ProductoServicio productoServicio

    BigDecimal cantidad

    BigDecimal importe

    String comentario

    ComprobanteFiscalConcepto cfdiDet

    Boolean inversion = false

    Date dateCreated

    Date lastUpdated

    static constraints = {
        sucursal nullable: true
        cuentaContable nullable: true
        comentario nullable: true
        productoServicio nullable: true
    }

}
