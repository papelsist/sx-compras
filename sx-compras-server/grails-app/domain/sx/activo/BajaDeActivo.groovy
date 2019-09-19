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


	BigDecimal moiFiscal = 0.0
    BigDecimal depreciacionAcumuladaFiscal = 0.0
    BigDecimal remanenteFiscal = 0.0
    BigDecimal inpcMedioUso = 0.0
    BigDecimal inpc = 0.0
    BigDecimal factor = 0.0
    BigDecimal costoActualizadoFiscal = 0.0
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
    }

    static mapping = {
    	fecha type: 'date'
    	fechaFactura type: 'date'
    }

    static belongsTo = [activo: ActivoFijo]
}
