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

	BigDecimal depreciacionAcumulada = 0.0

	BigDecimal remanente = 0.0

	String comentario

	Date dateCreated
	Date lastUpdated

	String createUser
	String updateUser

    static constraints = {
    	createUser nullable: true
    	updateUser nullable: true
    	comentario nullable: true
    }

    static mapping = {
    	fecha type: 'date'
    }

    static belongsTo = [activo: ActivoFijo]
}
