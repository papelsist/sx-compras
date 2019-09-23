package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@ToString(includes ='id, fecha',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id')
class BajaDeActivo {

	ActivoFijo activo

	Date fecha

	String comentario
	String facturaSerie
	String facturaFolio

	Date fechaFactura

	BigDecimal importeDeVenta

    BigDecimal moiContable = 0.0
    BigDecimal depreciacionContable = 0.0
    BigDecimal remanenteContable = 0.0
    BigDecimal utilidadContable = 0.0

    BigDecimal inpcMedioUso = 0.0
    BigDecimal inpc = 0.0
    BigDecimal factor = 0.0


	BigDecimal moiFiscal = 0.0
    BigDecimal depreciacionFiscalAcunulada = 0.0
    BigDecimal depreciacionFiscalEjercicioAnterior = 0.0
    BigDecimal depreciacionFiscalEjercicio = 0.0
    BigDecimal depreciacionFiscalEjercicioActualizada = 0.0
    BigDecimal costoFiscal = 0.0
    BigDecimal costoFiscalActualizado = 0.0
    BigDecimal utilidadFiscal = 0.0

	Date dateCreated
	Date lastUpdated

	String createUser
	String updateUser

    static constraints = {
    	createUser nullable: true
    	updateUser nullable: true
    	comentario nullable: true
    	facturaSerie nullable: true
    	facturaFolio nullable: true
    	fechaFactura nullable: true
        inpc scale: 4
        inpcMedioUso scael: 4
    }

    static mapping = {
    	fecha type: 'date'
    	fechaFactura type: 'date'
    }

    static belongsTo = [activo: ActivoFijo]
}
