package sx.core


import groovy.transform.EqualsAndHashCode


@EqualsAndHashCode(includes='id, producto, proveedor')
class ProveedorProducto {

    String id

    Proveedor proveedor

    Producto producto

    String claveProveedor

    String codigoProveedor

    String descripcionProveedor

    Integer paqueteTarima = 0

    Integer piezaPaquete = 0

    BigDecimal precioBruto = 0.0

    BigDecimal desc1 = 0.0

    BigDecimal desc2 = 0.0

    BigDecimal desc3 = 0.0

    BigDecimal desc4 = 0.0

    BigDecimal precio = 0.0

    Date fecha

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    static constraints = {
        claveProveedor nullable:true
        codigoProveedor nullable:true
        descripcionProveedor nullable:true
        fecha nullable: true
        dateCreated nullable: true
        lastUpdated nullable: true
    }

    static mapping = {
        id generator:'uuid'
    }

    String toString() {
        return "${producto.clave} - ${claveProveedor} (Prov: ${proveedor.clave}) "
    }
}
