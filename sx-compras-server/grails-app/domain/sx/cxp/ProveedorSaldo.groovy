package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@ToString(excludes =  ['version','lastUpdated', 'dateCreated'], includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['proveedor','ejercicio', 'mes'])
@GrailsCompileStatic
class ProveedorSaldo {

    Proveedor proveedor

    String nombre

    Integer ejercicio

    Integer mes

    BigDecimal saldoInicial = 0.0
    BigDecimal cargos = 0.0
    BigDecimal abonos = 0.0
    BigDecimal saldoFinal = 0.0

    Date lastUpdated
    Date dateCreated


    static constraints = {
        mes min: 1, max: 13
        nombre nullable: true
    }

    static mapping = {
        proveedor unique: ['ejercicio','mes']
    }

    def beforeInsert() {
        nombre = proveedor.nombre
    }
}
