package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

/**
 *
 */
@ToString(includes = ['descripcion, cuentaContable'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id'])
class ProductoServicio {

    String id

    String descripcion

    String cuentaContable

    Boolean inversion = false

    static  mapping={
        id generator:'uuid'
    }

}
