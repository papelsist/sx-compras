package sx.logistica

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cxc.CuentaPorCobrar
import sx.tesoreria.MovimientoDeCuenta

@GrailsCompileStatic
@EqualsAndHashCode(includes='id, nombre, tipo, fecha')
@ToString(excludes = 'version, dateCreated,lastUpdated, partidas', includeNames=true, includePackage=false)
class FacturistaPrestamo {

    FacturistaDeEmbarque facturista

    String tipo

    String nombre

    Date fecha

    Date autorizacion

    String autorizo

    BigDecimal importe

    String comentario

    MovimientoDeCuenta egreso

    CuentaPorCobrar cxc

    String createUser
    String updateUser

    Date dateCreated

    Date lastUpdated


    static constraints = {
        comentario nullable:true
        egreso nullable: true
        tipo inList: ['CAMIONETA', 'REPARACION', 'MANTENIMIENTO', 'PERSONAL', 'SEGURO', 'OTROS']
        createUser nullable: true
        updateUser nullable: true
    }

    static  mapping = {
        fecha type: 'date'
        autorizacion type: 'date'
    }

}




