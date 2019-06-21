package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.contabilidad.CuentaContable

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

    static  mapping={
        // id generator:'uuid'
    }

}
