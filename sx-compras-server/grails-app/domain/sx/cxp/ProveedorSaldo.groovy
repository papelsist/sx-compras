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

    BigDecimal saldoInicial
    BigDecimal cargos
    BigDecimal abonos
    BigDecimal saldoFinal

    Date lastUpdated
    Date dateCreated


    static constraints = {
        mes min: 1, max: 13
    }

    static mapping = {
        proveedor unique: ['ejercicio','mes']
    }
}
