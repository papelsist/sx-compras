package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includeNames=true,includePackage=false, excludes = ['id','version', 'partidas'])
@EqualsAndHashCode(includeFields = true,includes = ['id', 'fecha', 'linea','descripcion'])
class ListaDePreciosVenta {

    String id

    Date fecha

    String descripcion

    String moneda = 'MXN'

    BigDecimal tipoDeCambio = 1.0

    String linea = 'TODAS'

    Date inicio

    Date aplicada

    Set<ListaDePreciosVentaDet> partidas

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        aplicada nullable:true
        sw2 nullable:true
        tipoDeCambioDolar(scale:6)
        autorizacion nullable:true
        createUser nullable: true
        updateUser nullable: true
    }

    static hasMany =[partidas:ListaDePreciosVentaDet]

    static mapping ={
        table 'LISTA_DE_PRECIOS_VENTA2'
        id generator:'uuid'
        partidas cascade: "all-delete-orphan"
        fecha type:'date', index: 'LPV2_IDX1'
    }


}
