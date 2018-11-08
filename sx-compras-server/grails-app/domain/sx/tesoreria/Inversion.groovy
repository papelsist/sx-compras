package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='id')
@ToString(includeNames=true,includeSuper = true, includePackage=false, includes = ['rendimientoReal', 'tasa'])
class Inversion extends Traspaso{


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
	

    static constraints = {
		rendimientoFecha(nullable:true)
		vencimiento(validator:{val,obj ->
			if(val<obj.fecha)
				return "vencimientoInvalido" 
		})
		retorno nullable: true
    }
	
	static mapping ={
        rendimientoFecha type:'date'
		vencimiento type: 'date'
		retorno type: 'date'
    }
	
}
