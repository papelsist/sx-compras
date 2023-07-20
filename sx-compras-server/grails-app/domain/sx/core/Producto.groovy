package sx.core

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode
import sx.sat.ProductoSat
import sx.sat.UnidadSat
import sx.ecommerce.ClasificacionEcommerce
import sx.ecommerce.UsoEcommerce

@ToString(includes='id,clave,decripcion',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id,clave')
class Producto {

    String id

    String clave

    String descripcion

    String unidad

    String	modoVenta

    String codigo

    Boolean activo = true

    BigDecimal kilos = 0

    BigDecimal gramos = 0

    BigDecimal calibre = 0

    Integer caras = 0

    String color

    String acabado

    String presentacion

    Boolean nacional = true

    BigDecimal ancho

    BigDecimal largo

    Boolean deLinea = true

    BigDecimal precioContado  = 0.0

    BigDecimal precioCredito = 0.0

    Date fechaLista

    BigDecimal m2XMillar = 0.0

    Boolean inventariable = true

    Linea linea

    Marca marca

    Clase clase

    GrupoDeProducto grupo

    Proveedor proveedorFavorito

    String	comentario

    Long ajuste = 0

    Long sw2

    Date dateCreated

    Date lastUpdated

    ProductoSat productoSat

    UnidadSat unidadSat

    /* Propiedades para Ecommerce*/

    String clasificacion

    ClasificacionEcommerce clasificacionEcommerce

    UsoEcommerce usoEcommerce

    String tipoEcommerce

    Boolean paquete = false

    Boolean activoEcommerce = false

    BigDecimal hojasPaquete = 0.00

    BigDecimal stock = 0.00

    String tags
    
    BigDecimal precioTarjeta = 0.0

    static constraints = {

        unidad minSize:2,maxSize:10
        codigo nullable:true
        caras range:0..2
        color nullable:true, maxSize:15
        acabado nullable:true, maxSize:20
        presentacion inList:['EXTENDIDO','CORTADO','BOBINA','ND']
        ancho nullable:true
        largo nullable:true
        fechaLista nullable:true
        sw2 nullable:true
        linea nullable:true
        marca nullable: true
        clase nullable: true
        proveedorFavorito nullable:true
        modoVenta inList: ['B','N']
        comentario nullable: true
        productoSat nullable: true
        unidadSat nullable: true
        grupo nullable: true
        tags nullable:true
        clasificacion nullable:true
        tipoEcommerce nullable:true
        paquete nullable:true
        activoEcommerce nullable:true
        hojasPaquete nullable:true
        stock nullable:true
        clasificacionEcommerce nullable:true
        usoEcommerce nullable:true
    }

    static mapping={
        id generator:'uuid'
    }


}
