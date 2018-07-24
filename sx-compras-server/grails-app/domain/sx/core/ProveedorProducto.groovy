package sx.core


import groovy.transform.EqualsAndHashCode


@EqualsAndHashCode(includes='id, proveedor, producto')
class ProveedorProducto {

    String id

    Proveedor proveedor

    Producto producto

    String claveProveedor

    String codigoProveedor

    String descripcionProveedor

    Integer paqueteTarima = 0

    Integer piezaPaquete = 0

    String moneda = 'MXN'

    BigDecimal precioBruto = 0.0

    BigDecimal desc1 = 0.0

    BigDecimal desc2 = 0.0

    BigDecimal desc3 = 0.0

    BigDecimal desc4 = 0.0

    BigDecimal precio = 0.0

    Long lista

    Date aplicado

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    static constraints = {
        claveProveedor nullable:true
        codigoProveedor nullable:true
        descripcionProveedor nullable:true
        aplicado nullable: true
        lista nullable: true
        dateCreated nullable: true
        lastUpdated nullable: true
        createUser nullable: true
        updateUser nullable: true
        moneda maxSize: 5
    }

    static mapping = {
        id generator:'uuid'
        producto unique: ['moneda']
    }

    String toString() {
        return "${producto.clave} - ${claveProveedor} (Prov: ${proveedor.clave}) "
    }
}
