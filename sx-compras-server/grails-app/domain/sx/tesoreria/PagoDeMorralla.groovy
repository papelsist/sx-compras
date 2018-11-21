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

    Proveedor proveedor

    String formaDePago

    BigDecimal importe

    String referencia

    String comentario

    MovimientoDeCuenta egreso

    List<Morralla> partidas

    Set<MovimientoDeCuenta> movimientos

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static hasMany = [partidas: Morralla]

    static constraints = {
        referencia nullable: true
        comentario nullable: true
        egreso nullable: true
        createUser nullable: true
        updateUser nullable: true

    }

    static mapping ={
        fecha type:'date'
        movimientos cascade: "all-delete-orphan"
    }

}

