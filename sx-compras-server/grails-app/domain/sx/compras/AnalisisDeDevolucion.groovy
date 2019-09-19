package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.cxp.NotaDeCreditoCxP

@ToString(includes = 'folio, serie, clave, cantidad', includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = 'id, decFolio, clave, cantidad, dec')
class AnalisisDeDevolucion {

	NotaDeCreditoCxP nota
	String nombre
	String folio
    String serie

	DevolucionDeCompraDet dec
	String sucursal
    Long decFolio
    Date decFecha
    String referencia
    Date fechaReferencia
	String clave
	String descripcion
    String unidad
    BigDecimal cantidad = 0.0
    BigDecimal costo = 0.0
    BigDecimal importe = 0.0

	Date dateCreated
	Date lastUpdated

	String createUser
	String updateUser

    static constraints = {
    	folio nullable: true
    	serie nullable: true
        referencia nullable: true
        fechaReferencia nullable: true
    	createUser nullable: true
    	updateUser nullable: true
    }
}
