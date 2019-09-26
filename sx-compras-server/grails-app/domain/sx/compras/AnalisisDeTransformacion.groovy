package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.incentario.TransformacionDet


@ToString(includes = 'folio, serie, clave, cantidad', includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = 'id, uuid')
class AnalisisDeTransformacion {

    Proveedor proveedor
    
    String nombre
	
    Date fecha

    CuentaPorPagar cxp

    String uuid
	
    BigDecimal importe = 0.0

	Date dateCreated
	Date lastUpdated

	String createUser
	String updateUser

    Set<TransformacionDet> partidas = 

    static constraints = {
    	createUser nullable: true
    	updateUser nullable: true
    }

    static mapping = {
        fecha type: 'date'
    }
}
