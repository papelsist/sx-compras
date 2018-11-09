package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode


// @GrailsCompileStatic
@EqualsAndHashCode(includes='id')
@ToString(includeNames=true,includePackage=false, includes = ['cuentaOrigen', 'cuentaDestino', 'importe'])
class Traspaso {
	
	Date fecha

	CuentaDeBanco cuentaOrigen

	CuentaDeBanco cuentaDestino

	String moneda = 'MXN'

	BigDecimal importe = 0.0

	BigDecimal comision = 0.0

	BigDecimal impuesto = 0.0

	String comentario

	String referencia
	
	Date dateCreated

	Date lastUpdated

	String createUser
	String updateUser

	List<MovimientoDeCuenta> movimientos

	Long sw2

	
	static hasMany = [movimientos:MovimientoDeCuenta]

    static constraints = {
		cuentaDestino validator:{val, obj ->
			if(obj.cuentaOrigen==val)
				return "mismaCuentaError"
			if(obj.cuentaOrigen.moneda!=val.moneda)
				return "diferenteMonedaError"
			
		}
		comentario nullable: true
		createUser nullable: true
		updateUser nullable: true
		referencia nullable: true
		sw2 nullable: true
    }
	
	static mapping ={
		fecha type: 'date'
		movimientos cascad:"all-delete-orphan"
	}
	
	
}
