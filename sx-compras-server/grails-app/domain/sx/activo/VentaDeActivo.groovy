package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@ToString( excludes= ['version, activo'], includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id')
class VentaDeActivo extends BajaDeActivo{

	String facturaSerie

	String facturaFolio

	Date fechaFactura

	BigDecimal importeDeVenta

    static constraints = {
    	facturaSerie nullable: true
    	facturaFolio nullable: true
    	fechaFactura nullable: true
    }

    static mapping = {
    	fechaFactura type: 'date'
    }
}
