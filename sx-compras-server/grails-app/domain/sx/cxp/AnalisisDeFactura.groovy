package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@ToString(includes = ['folio', 'nombre', 'importe'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id'])
class AnalisisDeFactura {

    String id

    Long folio

    String nombre

    Proveedor proveedor

    Date fecha = new Date()

    CuentaPorPagar factura

    String comentario

    BigDecimal importe = 0.0

    BigDecimal importeFlete = 0.0

    BigDecimal impuestoFlete = 0.0

    BigDecimal retencionFlete = 0.0

    List<AnalisisDeFacturaDet> partidas = []

    Date cerrado

    Long sw2

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static hasMany =[partidas: AnalisisDeFacturaDet]

    static constraints = {
        comentario nullable:true
        cerrado nullable:true
        sw2 nullable:true
    }

    static mapping = {
        partidas cascade: "all-delete-orphan"
        id generator:'uuid'
        fecha type:'date' ,index: 'ANALISIS_IDX1'
        cerrado type: 'date'
    }

    def beforeValidate() {
        if(proveedor) {
            this.nombre = proveedor.nombre;
        }
    }


}
