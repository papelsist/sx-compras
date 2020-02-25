package sx.inventario

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic

import sx.core.Autorizacion
import sx.core.Sucursal
import sx.core.Venta
import sx.logistica.Chofer

@GrailsCompileStatic
@ToString(excludes =  'id, partidas, venta, chofer', includeNames = true, includePackage = false)
@EqualsAndHashCode(includes=['id', 'sucursal', 'documento'])
class Transformacion {

    String id

    Sucursal sucursal

    Autorizacion autorizacion

    String tipo

    Long documento

    Date fecha

    Venta venta

    Boolean	porInventario

    String	comentario

    List partidas = []

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    String sw2

    Date fechaInventario

    Date cancelado

    Chofer chofer

    static  hasMany = [partidas:TransformacionDet]


    static constraints = {
        autorizacion nullable: true
        tipo nullable: true
        venta nullable: true
        comentario nullable: true
        sw2 nullable: true
        dateCreated nullable: true
        lastUpdated nullable: true
        createUser nullable: true
        updateUser nullable: true
        porInventario nullable: true
        fechaInventario nullable: true
        cancelado nullable: true
        chofer nullable: true

    }


    static mapping = {
        id generator:'uuid'
        fecha index: 'FECHA_IDX'
        sucursal index: 'SUCURSAL_IDX'
    }


}
