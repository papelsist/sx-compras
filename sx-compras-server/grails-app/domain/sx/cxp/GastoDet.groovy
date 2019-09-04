package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.contabilidad.CuentaContable
import sx.core.Sucursal


@ToString(includes = ['descripcion', 'cantidad', 'importe'], includeNames = true, includePackage = false)
@EqualsAndHashCode(includeFields = true,includes = ['id'])
class GastoDet {

	CuentaPorPagar cxp

    CuentaContable cuentaContable

    Sucursal sucursal
    String sucursalNombre

    String descripcion

    String comentario
    
    Boolean activoFijo = false

    String cfdiDet
    String cfdiUnidad
    String cfdiDescripcion
    String claveProdServ
    

    BigDecimal cantidad
    BigDecimal valorUnitario
    BigDecimal importe
    BigDecimal descuento = 0.0

    BigDecimal isrRetenido = 0.0
    BigDecimal isrRetenidoTasa = 0.0
    BigDecimal ivaRetenido = 0.0
    BigDecimal ivaRetenidoTasa = 0.0
    BigDecimal ivaTrasladado = 0.0
    BigDecimal ivaTrasladadoTasa = 0.0

    String modelo
    String serie

    // Fletes
    BigDecimal facturistaPrestamo = 0.0
    BigDecimal facturistaVales = 0.0
    BigDecimal facturistaCargos = 0.0

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        
        cuentaContable nullable: true

        comentario nullable: true
        updateUser nullable: true
        createUser nullable: true

        cfdiDet nullable: true
        cfdiDescripcion nullable: true
        cfdiUnidad nullable: true
        claveProdServ nullable: true 
        
        modelo nullable: true
        serie nullable: true

        sucursalNombre maxSize: 30
    }
}
