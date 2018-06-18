package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@ToString(excludes ='id,version,dateCreated,lastUpdated,sw2,partidas',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id')
class Requisicion {

    String id

    Long folio

    Proveedor proveedor

    String nombre

    String moneda = 'MXN'

    BigDecimal tipoDeCambio = 0.0

    Date fecha

    Date fechaDePago

    String formaDePago = 'CHEQUE'

    BigDecimal total = 0.0

    List partidas = []

    String comentario

    Long sw2

    Date dateCreated

    Date lastUpdated

    String createUser
    String updateUser

    static hasMany = [partidas: RequisicionDet]

    static constraints = {
        total scale:4
        tipoDeCambio scale: 6
        formaDePago inList:['TRANSFERENCIA','CHEQUE']
        comentario nullable:true
        sw2 nullable:true
    }

    static mapping = {
        id generator:'uuid'
        partidas cascade: "all-delete-orphan"
        nombre index: 'REQ_IDX1'
        fechaDePago type:'date' , index: 'REQ_IDX2'
        fecha type:'date', index: 'REQ_IDX3'
    }

    def actualizar(){
        if(!nombre)
            nombre = proveedor.nombre
    }

    def beforeInsert(){
        actualizar()
    }

    /*
    enum Entidad {
        GASTOS, COMPRAS, REEMBOLSO, NOMINA, GENERICA, COMISION, COMPRA_DOLARES, TESORERIA
    }
    */

}
