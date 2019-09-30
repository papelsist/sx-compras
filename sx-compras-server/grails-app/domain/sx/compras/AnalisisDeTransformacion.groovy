package sx.compras

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


import sx.inventario.TransformacionDet
import sx.cxp.CuentaPorPagar


@ToString(includes = 'folio, serie, clave, cantidad', includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = 'id, uuid')
class AnalisisDeTransformacion {

    
    String nombre
	
    Date fecha

    CuentaPorPagar cxp

    String uuid
	
    BigDecimal importe = 0.0

    String comentario

	Date dateCreated
	Date lastUpdated

	String createUser
	String updateUser

    Set<TransformacionDet> partidas

    static constraints = {
    	createUser nullable: true
    	updateUser nullable: true
    }

    static mapping = {
        fecha type: 'date'
    }
}
