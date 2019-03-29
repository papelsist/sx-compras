package sx.logistica

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode

import sx.inventario.Traslado


@GrailsCompileStatic
@EqualsAndHashCode(includes='id, envio')
class EnvioComision {

    Chofer chofer

    String nombre

    Envio envio

    Traslado traslado

    Date fechaComision

    BigDecimal valor = 0.0

    BigDecimal kilos = 0.0

    String comentarioDeComision

    Boolean comisionPorTonelada = false

    BigDecimal importeComision = 0.0

    BigDecimal comision = 0.0

    BigDecimal precioTonelada = 0.0

    BigDecimal maniobra = 0.0

    Date regreso

    String sucursal

    String documentoFolio

    String documentoTipo

    Date documentoFecha

    BigDecimal valorCajas = 0.0

    boolean manual = false

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static constraints = {
        fechaComision nullable:true
        comentarioDeComision nullable: true
        envio nullable: true
        traslado nullable: true
        comisionPorTonelada nullable: true
        documentoFolio nullable: true
        documentoFecha nullable: true
        documentoFecha nullable: true
    }

    static  mapping = {
        fechaComision type: 'date'
        regreso type: 'date'
        documentoFecha type: 'date'
    }
}
