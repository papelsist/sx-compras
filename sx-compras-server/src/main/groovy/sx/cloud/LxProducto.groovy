package sx.cloud

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode

// import grails.web.databinding.WebDataBinding

import sx.core.Producto

@ToString(includeNames=true,includePackage=false)
@EqualsAndHashCode(includes = 'id, clave, unidad')
class LxProducto {

    String id
    String clave
    String descripcion
    String unidad
    Double precioContado
    Double precioCredito
    
    Boolean activo
    String	modoVenta
    String presentacion
    double kilos
    double gramos
    double calibre
    String color
    Boolean nacional
    double ancho
    double largo
    double m2XMillar 
    Boolean inventariable

    String linea
    String marca
    String clase

    String imageUrl
    Date lastUpdated

    String claveSat
    String unidadSat

    double disponible

    // List<LxExistencia> existencias = []
    

    LxProducto(Producto prod) {
        copyProperties(prod, this)
        this.id = prod.id
        this.claveSat = prod.productoSat ? prod.productoSat.claveProdServ : null
        this.unidadSat = prod.unidadSat ? prod.unidadSat.claveUnidadSat : null

    }
    
    def copyProperties(source, target) {
        def (sProps, tProps) = [source, target]*.properties*.keySet()
        def commonProps = sProps.intersect(tProps) - ['class', 'metaClass', 'additionalMetaMethods']
        commonProps.each { target[it] = source[it] }
    }

    Map toMap() {
        Map data = this.properties
        data = data.findAll{ k, v -> k != 'class'}
        return data
    }
    

}
/*
class LxExistencia {
    String almacen
    double cantidad
    double apartado
    double disponible
}
*/
