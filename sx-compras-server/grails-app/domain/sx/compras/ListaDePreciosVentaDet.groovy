package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Producto
import sx.core.Proveedor

@ToString(includeNames=true,includePackage=false, excludes = ['lastUpdated', 'dateCreated','id','version'])
@EqualsAndHashCode(includeFields = true, excludes = "clave")
class ListaDePreciosVentaDet {

    String id

    ListaDePreciosVenta lista
    
    Producto producto

    String clave

    String descripcion

    String linea
    String marca
    String clase

    BigDecimal precioContado = 0.0

    BigDecimal precioCredito = 0.0
    
    BigDecimal precioAnteriorContado = 0.0
    
    BigDecimal precioAnteriorCredito = 0.0
    
    BigDecimal costo = 0.0
    
    BigDecimal costoUltimo = 0.0
    
    BigDecimal incremento = 0.0
    
    BigDecimal factorContado = 0.0
    
    BigDecimal factorCredito = 0.0

    Proveedor proveedor

    Date dateCreated
    Date lastUpdated

    static constraints = {
        proveedor nullable:true
        marca nullable: true
        clase nullable: true
    }

    static mapping ={
        id generator:'uuid'
        table 'LISTA_DE_PRECIOS_VENTA_DET2'
    }

    static belongsTo =[lista:ListaDePreciosVenta]
}
