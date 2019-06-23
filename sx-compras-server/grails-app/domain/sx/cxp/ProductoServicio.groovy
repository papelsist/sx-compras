package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.contabilidad.CuentaContable
import sx.sat.ProductoSat
import sx.sat.ProductoSatClase

/**
 *
 */
@ToString(includes = ['descripcion, cuentaContable'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id'])
class ProductoServicio {

    Long id

    CuentaContable cuentaContable

    String descripcion

    String clasificacion

    Boolean inversion = false

    ProductoSatClase clase

    static  mapping={
        // id generator:'uuid'
        clase nullable: true
    }

}
