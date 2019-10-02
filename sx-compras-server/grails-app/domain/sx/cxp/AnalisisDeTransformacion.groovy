package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.cxp.CuentaPorPagar
import sx.core.Proveedor


@ToString(includes = 'folio, serie, clave, cantidad', includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = 'id, uuid')
class AnalisisDeTransformacion {
    
    Proveedor proveedor

    String nombre
	
    Date fecha

    CuentaPorPagar cxp

    String uuid
	
    BigDecimal analizado = 0.0

    String comentario

    List<AnalisisDeTransformacionDet> partidas = []

    Date cerrada

	Date dateCreated
	Date lastUpdated

	String createUser
	String updateUser

    static hasMany = [partidas: AnalisisDeTransformacionDet]
    

    static constraints = {
        cxp nullable: true
        uuid nullable: true
    	createUser nullable: true
    	updateUser nullable: true
        cerrada nullable: true
    }

    static mapping = {
        fecha type: 'date'
        cerrada type: 'date'
        partidas cascade: "all-delete-orphan"
        analizado formula:'(select COALESCE(sum(x.importe),0) from analisis_de_transformacion_det x where x.analisis_id=id)'
    }
}
