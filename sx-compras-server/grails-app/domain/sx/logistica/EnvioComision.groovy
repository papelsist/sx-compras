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

    BigDecimal comisionPorTonelada = 0.0

    BigDecimal importeComision = 0.0

    BigDecimal comision = 0.0

    BigDecimal precioTonelada = 0.0

    BigDecimal maniobra = 0.0

    Date regreso

    String sucursal

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser


    static constraints = {
        fechaComision nullable:true
        comentarioDeComision nullable: true
        envio nullable: true
        traslado nullable: true
    }

    static  mapping = {
        fechaComision type: 'date'
    }
}
