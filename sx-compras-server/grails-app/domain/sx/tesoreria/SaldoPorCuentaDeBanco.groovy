package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.TupleConstructor

@ToString(includes = 'ejercicio, mes, cuenta, saldoInicial, ingresos, egresos, saldoFinal', includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id, cuenta, ejercicio, mes'])
@TupleConstructor(excludes = 'id, dateCreated, lastUpdated, createUser, updateUser')
class SaldoPorCuentaDeBanco {

    Integer ejercicio

    Integer mes

	CuentaDeBanco cuenta

    String numero

    String descripcion

	BigDecimal saldoInicial

	BigDecimal ingresos

	BigDecimal egresos

	BigDecimal saldoFinal

	Date cierre
	
	Date dateCreated

	Date lastUpdated

	String createUser

	String updateUser


    static constraints = {
    	mes inList:(1..12)
    	cuenta unique:['ejercicio','mes']
		cierre nullable:true
		createUser nullable: true
		updateUser nullable: true
    }

    
}
