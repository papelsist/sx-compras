package sx.compras

import grails.compiler.GrailsCompileStatic

import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode


@ToString(excludes = 'id, version, partidas',includeNames = true, includePackage = false)
@EqualsAndHashCode(includes='sucursal,folio')
@GrailsCompileStatic
class RequisicionDeMaterial {

    String id

    String clave

    String proveedor

    String rfc

    String sucursal

    String moneda

    Long folio

    Date fecha

    String comentario

    Set<RequisicionDeMaterialDet> partidas

    Date cerrada
    String compra 

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        comentario nullable:true
        clave maxSize: 15
        rfc maxSize: 14
        folio unique:['sucursal']
        cerrada nullable: true
        compra nullable: true
        createUser nullable: true
        updateUser nullable: true
        moneda maxSize: 3
    }

    static hasMany = [partidas:RequisicionDeMaterialDet]

    static mapping = {
        id generator:'uuid'
        partidas cascade: "all-delete-orphan"
        fecha type:'date', index: 'REQ_MATERIAL_IDX1'
        cerrada type: 'date'
    }
    

}

