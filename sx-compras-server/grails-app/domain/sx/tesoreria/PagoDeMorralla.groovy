package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor


@EqualsAndHashCode(includes='id')
@ToString( excludes = "version, lastUpdated, dateCreated", includeNames=true,includePackage=false)
class PagoDeMorralla {

    CuentaDeBanco cuentaEgreso

    CuentaDeBanco cuentaIngreso

    Date fecha

    Date fechaInicial

    Date fechaFinal

    Proveedor proveedor

    String formaDePago

    BigDecimal importe

    String referencia

    String comentario

    MovimientoDeCuenta ingreso

    List<Morralla> partidas

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static hasMany = [partidas: Morralla]

    static constraints = {
        ingreso nullable: true
        createUser nullable: true
        updateUser nullable: true

    }

    static mapping ={
        fecha type:'date'
        fechaInicial type: 'date'
        fechaFinal type: 'date'
        // partidas cascade: "all-delete-orphan"
    }

}

