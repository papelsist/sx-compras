package sx.cxc

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.tesoreria.MovimientoDeCuenta

@GrailsCompileStatic
@ToString(excludes = ["id,lastUpdated,dateCreated"],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id'])
class ChequeDevuelto {

    String	id

    Long folio

    Date fecha

    String nombre

    CobroCheque cheque

    CuentaPorCobrar	cxc

    MovimientoDeCuenta egreso

    Date recepcion

    String	comentario

    String	sw2

    Date dateCreated

    Date lastUpdated

    String createUser

    String updateUser

    static constraints = {
        comentario nullable:true
        createUser nullable: true
        updateUser nullable: true
        sw2 nullable:true
        cxc unique: true
        cheque unique: true
        egreso unique: true, nullable: true
        recepcion nullable: true
        fecha nullable: true
    }

    static mapping = {
        id generator:'uuid'
        recepcion type: 'date'
        fecha type: 'date'
    }
}
