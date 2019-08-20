package sx.compras

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode


@ToString(includes = 'producto,solicitado,importeNeto', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = 'id, producto,  descripcion, solicitado')
class RequisicionDeMaterialDet {

    String id

    RequisicionDeMaterial requisicion

    String producto

    String descripcion

    String unidad

    String sucursal

    BigDecimal solicitado = 0.0

    String comentario

    Date dateCreated

    Date lastUpdated

    String updateUser
    String createUser

    static constraints = {
        producto maxSize: 20
        comentario nullable: true
        unidad maxSize: 10
    }

    static mapping = {
        id generator: 'uuid'
    }

    static belongsTo = [requisicion: RequisicionDeMaterial]

}
