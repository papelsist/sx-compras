package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='id')
@ToString(includeNames=true,includeSuper = true, includePackage=false, includes = ['rendimientoReal', 'tasa'])
class Inversion extends Traspaso{


	BigDecimal rendimientoReal = 0.0

	BigDecimal rendimientoCalculado = 0.0

	BigDecimal rendimientoImpuesto = 0.0
	
	BigDecimal tasa = 16.00

	BigDecimal tasaIsr = 0.0

	BigDecimal importeIsr = 0.0
	
	Integer plazo = 1
	
	Date vencimiento

	Date rendimientoFecha = new Date()
	

    static constraints = {
		rendimientoFecha(nullable:true)
		vencimiento(validator:{val,obj ->
			if(val<obj.fecha)
				return "vencimientoInvalido" 
		})
    }
	
	static mapping ={
        rendimientoFecha type:'date'
		vencimiento type: 'date'
    }
	
}
