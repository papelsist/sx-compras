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
    }

    static mapping = {
    	fechaFactura type: 'date'
    }
}
