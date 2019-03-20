package sx.logistica

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.tesoreria.MovimientoDeCuenta

@GrailsCompileStatic
@EqualsAndHashCode(includes='id, nombre, tipo, fecha')
@ToString(excludes = 'version, dateCreated,lastUpdated, partidas', includeNames=true, includePackage=false)
class PrestamoChofer {

    Chofer chofer

    TipoDePrestamo tipo

    String nombre

    Date fecha

    Date autorizacion

    String autorizo

    BigDecimal importe

    String comentario

    MovimientoDeCuenta egreso

    List<PrestamoChoferDet> partidas

    String createUser
    String updateUser

    Date dateCreated

    Date lastUpdated

    static hasMany = [partidas: PrestamoChoferDet]

    static constraints = {
        comentario nullable:true
        egreso nullable: true
    }

    static  mapping = {
        fecha type: 'date'
        autorizacion type: 'date'
    }

}

enum TipoDePrestamo {
    CAMIONETA,
    REPARACION,
    MANTENIMIENTO,
    PERSONAL,
    SEGURO,
    OTROS
}



