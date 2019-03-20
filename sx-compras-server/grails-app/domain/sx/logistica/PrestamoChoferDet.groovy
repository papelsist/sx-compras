package sx.logistica

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

/**
 * id	BIGINT
 * prestamo_id	BIGINT
 * fecha	DATE
 * concepto	VARCHAR
 * importe	DECIMAL
 * corte	DECIMAL
 * intereses	DECIMAL
 * abono	DECIMAL
 * saldo	DECIMAL
 * comentarios	VARCHAR
 * cetes	DECIMAL  (4)
 */
@GrailsCompileStatic
@EqualsAndHashCode(includes='id, envio')
@ToString(excludes = 'version, dateCreated,lastUpdated, partidas', includeNames=true, includePackage=false)
class PrestamoChoferDet {

    PrestamoChofer prestamo

    Date fecha

    ConceptoDePrestamo concepto

    BigDecimal importe

    BigDecimal corte

    BigDecimal intereses

    BigDecimal abono

    BigDecimal saldo

    BigDecimal cetes

    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated

    static constraints = {

    }

    static belongsTo = [prestamo: PrestamoChofer]

    static  mapping = {
        fecha type: 'date'
    }


}

enum ConceptoDePrestamo {
    CargoPrestamoPersonal('A'),
    SeguraAutomitriz('B'),
    AbonoPrestamoPersonal('C'),
    AbonoSeguroDelSeguro('D')

    private String id


    ConceptoDePrestamo(String id) {
        this.id = id
    }
}


