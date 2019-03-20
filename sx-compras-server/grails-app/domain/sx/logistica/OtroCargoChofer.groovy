package sx.logistica

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@GrailsCompileStatic
@ToString(includes='fuente, tasa fecha', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes='fecha,fuente')
class OtroCargoChofer {

    Chofer chofer

    String nombre

    BigDecimal importe

    BigDecimal saldo

    String comentario

    TipoCargo tipo

    List<OtroCargoChoferDet> partidas

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static hasMany = [partidas: OtroCargoChofer]


}

enum TipoCargo {
    MATERIAL,
    CELULAR,
    ETC,
    OTROS,
}
