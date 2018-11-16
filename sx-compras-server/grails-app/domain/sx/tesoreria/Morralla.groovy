package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Sucursal

@ToString(includes = ['sucursal,tipo','importe'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = "id")
class Morralla {

	String id

	Sucursal sucursal

	Date fecha // Fecha que asigna el usuario

	String tipo

	BigDecimal importe = 0.0

	String comentario

	Date dateCreated

	Date lastUpdated

	String createUser

	String updateUser

	MovimientoDeCuenta egreso


	static constraints = {
		comentario nullable: true
		createUser nullable: true
		updateUser nullable: true
		egreso nullable: true
	}

	static mapping = {
		id generator: 'uuid'
	}


}
