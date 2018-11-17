package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='id')
@ToString(includeNames=true, includePackage=false,
		excludes = ['version', 'dateCreated', 'movimientos'])
class Inversion {

	Date fecha

	CuentaDeBanco cuentaOrigen

	CuentaDeBanco cuentaDestino

	String moneda = 'MXN'

	BigDecimal importe = 0.0

	BigDecimal rendimientoReal = 0.0

	BigDecimal rendimientoCalculado = 0.0

	BigDecimal rendimientoImpuesto = 0.0

	BigDecimal tasa = 0.0

	Integer plazo

	Date vencimiento

	BigDecimal isr = 0.0

	BigDecimal isrImporte = 0.0

	Date rendimientoFecha  // La fecha real del vencimiento

	Date retorno

	String comentario

	String referencia

	Long sw2

	Date dateCreated

	Date lastUpdated

	String createUser
	String updateUser

	List<MovimientoDeCuenta> movimientos


	static hasMany = [movimientos:MovimientoDeCuenta]


    static constraints = {
		vencimiento(validator:{val,obj ->
			if(val<obj.fecha)
				return "vencimientoInvalido" 
		})
		retorno nullable: true
		rendimientoFecha nullable:true
		comentario nullable: true
		referencia nullable: true
		createUser nullable: true
		updateUser nullable: true
		sw2 nullable: true
    }
	
	static mapping ={
		fecha type: 'date'
        rendimientoFecha type:'date'
		vencimiento type: 'date'
		retorno type: 'date'
		movimientos cascad:"all-delete-orphan"
    }
	
}
