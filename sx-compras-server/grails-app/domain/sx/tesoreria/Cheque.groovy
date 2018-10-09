package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@ToString(includes = ['cuenta,folio'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'cuenta', 'folio'])
class Cheque {

	String id

	String nombre

	CuentaDeBanco cuenta

	Date fecha

	Long folio

	Date impresion

	MovimientoDeCuenta egreso
	
	Date cancelado

	String canceladoComentario

	// Date fechaDevolucion

	// MovimientoDeCuenta devolucion

	Boolean confidencial = false

	BigDecimal importe = 0.0

	Date liberado
	Date entregado
	Date cobrado

	Date dateCreated
	Date lastUpdated

	String createUser
	String updateUser
	

    static constraints = {
		egreso nullable: true
		impresion nullable:true
		cancelado nullable:true
		canceladoComentario nullable:true
		folio unique: ['cuenta']
		// fechaDevolucion nullable:true
		// devolucion nullable: true
		liberado nullable: true
		entregado nullable: true
		cobrado nullable: true
		createUser nullable: true
		updateUser nullable: true
    }

	static mapping = {
		id generator: 'uuid'
		fecha type: 'date'
		liberado type: 'date'
		entregado type: 'date'
		cobrado type: 'date'
		// fechaDevolucion type: 'date'
	}
    
   
}
