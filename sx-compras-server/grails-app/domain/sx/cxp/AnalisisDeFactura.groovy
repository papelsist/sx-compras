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

    List<AnalisisDeFacturaDet> partidas = []

    Long sw2

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static hasMany =[partidas: AnalisisDeFacturaDet]

    static constraints = {
        comentario nullable:true
        sw2 nullable:true
    }

    static mapping = {
        partidas cascade: "all-delete-orphan"
        id generator:'uuid'
        fecha type:'date' ,index: 'ANALISIS_IDX1'
    }

    def beforeValidate() {
        if(proveedor) {
            this.nombre = proveedor.nombre;
        }
    }


}
