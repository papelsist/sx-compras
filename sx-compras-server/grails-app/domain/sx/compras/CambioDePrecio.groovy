package sx.compras

import grails.compiler.GrailsCompileStatic

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode


@ToString(excludes = 'id, version, partidas',includeNames = true, includePackage = false)
@EqualsAndHashCode(includes = 'id,fecha, moneda, comentario')
@GrailsCompileStatic
class CambioDePrecio {

    String id

    String moneda

    String comentario

    Date fecha

    Date fechaDeAplicacion

    Set<CambioDePrecioDet> partidas

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        comentario nullable:true
        createUser nullable: true
        updateUser nullable: true
        moneda maxSize: 3

    }

    static hasMany = [partidas:CambioDePrecioDet]

    static mapping = {
        id generator:'uuid'
        partidas cascade: "all-delete-orphan"
        fecha type:'date', index: 'CAMBIO_PREC_IDX1'
    }
    

}

