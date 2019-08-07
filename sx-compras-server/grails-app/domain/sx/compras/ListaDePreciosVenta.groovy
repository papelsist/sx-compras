package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includeNames=true,includePackage=false, excludes = ['id','version', 'partidas'])
@EqualsAndHashCode(includeFields = true,includes = ['id', 'fecha', 'linea','descripcion'])
class ListaDePreciosVenta {

    // String id

    Date fecha

    String descripcion

    String moneda = 'MXN'

    BigDecimal tipoDeCambio = 1.0

    Date inicio

    Date aplicada

    Set<ListaDePreciosVentaDet> partidas

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        aplicada nullable:true
        inicio nullable: true
        tipoDeCambio scale:6
        createUser nullable: true
        updateUser nullable: true
    }

    static hasMany =[partidas:ListaDePreciosVentaDet]

    static mapping ={
        table 'LISTA_DE_PRECIOS_VENTA2'
        // id generator:'uuid'
        partidas cascade: "all-delete-orphan", sort: 'clave', order: 'asc'
        fecha type:'date', index: 'LPV2_IDX1'
    }



}
