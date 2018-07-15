package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.ProveedorProducto

@ToString(includeNames=true,includePackage=false, excludes = ['lastUpdated', 'dateCreated','id','version','lista'])
@EqualsAndHashCode(includeFields = true,includes = ['clave'])
class ListaDePreciosProveedorDet {

    ProveedorProducto producto

    String clave

    String descripcion

    String unidad

    BigDecimal precioBruto = 0.0

    BigDecimal neto = 0.0

    BigDecimal desc1 = 0.0

    BigDecimal desc2 = 0.0

    BigDecimal desc3 = 0.0

    BigDecimal desc4 = 0.0

    BigDecimal precioNeto = 0.0

    BigDecimal precioAnterior = 0.0

    Date dateCreated

    Date lastUpdated

    static constraints = {

    }

    static mapping ={

    }

    static belongsTo =[lista:ListaDePreciosProveedor]




}
