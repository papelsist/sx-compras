package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Inventario
import sx.core.Producto

@ToString(includes = ['producto', 'cantidad', 'comentario'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id'])
class DevolucionDeCompraDet {

    String id

    DevolucionDeCompra devolucionDeCompra

    Inventario inventario

    Producto producto

    BigDecimal cantidad = 0

    BigDecimal costoDec = 0

    BigDecimal importeCosto = 0

    String comentario

    String sw2

    Date dateCreated
    Date lastUpdated

    static belongsTo = [ devolucionDeCompra:DevolucionDeCompra ]

    static constraints = {
        comentario nullable: true
        inventario nullable: true
        sw2 nullable: true
    }

    static mapping = {
        id generator:'uuid'

    }

}
