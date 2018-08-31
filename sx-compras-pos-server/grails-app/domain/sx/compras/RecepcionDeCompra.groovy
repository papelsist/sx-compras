package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor
import sx.compras.Compra
import sx.core.Sucursal
import sx.compras.RecepcionDeCompraDet

@ToString(includes = 'remision,sucursal,fecha,comentario',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id,sucursal,documento')
class RecepcionDeCompra {

    String id

    Long documento = 0

    String remision

    Date fechaRemision

    Compra compra

    Proveedor proveedor

    Sucursal sucursal

    Date fecha

    String comentario

    List partidas = []

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    String sw2

    Date fechaInventario

    BigDecimal pendienteDeAnalisis = 0

    Date cancelado


    static hasMany =[partidas:RecepcionDeCompraDet]

    static constraints = {
        comentario nullable:true
        sw2 nullable:true
        remision nullable: true
        fechaRemision nullable: true
        dateCreated nullable: true
        lastUpdated nullable: true
        createUser nullable: true
        updateUser nullable: true
        fechaInventario nullable: true
        pendienteDeAnalisis nullable: true
        cancelado nullable: true
    }


    static mapping = {
        id generator:'uuid'
        partidas cascade: "all-delete-orphan"
        fecha type:'date', index: 'RECOMPRA_IDX1'
        cancelado type: 'date'
        // pendienteDeAnalisis formula: '(select COALESCE(sum(x.cantidad - x.analizado), 0) from recepcion_de_compra_det x where x.recepcion_id = id )'
    }

    def actualizarPendiente() {
        this.pendienteDeAnalisis = this.partidas.sum { it.cantidad - it.analizado}
    }



}
