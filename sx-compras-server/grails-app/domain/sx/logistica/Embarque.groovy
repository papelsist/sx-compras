package sx.logistica

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode

import sx.core.Sucursal


@GrailsCompileStatic
@EqualsAndHashCode(includes=['id', 'sucursal', 'documento'])
class Embarque {

    String	id

    Sucursal sucursal

    Integer	documento

    Date fecha

    Date cerrado

    Chofer chofer

    BigDecimal kilos

    Date regreso

    Date salida

    BigDecimal valor

    List<Envio> partidas = []

    String empleado

    String comentario

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static hasMany = [partidas : Envio ]

    static constraints = {
        cerrado  nullable: true
        chofer nullable: true
        comentario nullable: true
        documento nullable: true
        regreso nullable: true
        salida nullable: true
        createUser nullable: true
        updateUser nullable: true
        empleado nullable:true
    }

    static mapping= {
        id generator: 'uuid'
        partidas cascade: "all-delete-orphan"
        fecha type: 'date'
    }
}
