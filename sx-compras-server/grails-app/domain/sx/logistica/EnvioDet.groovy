package sx.logistica

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode

import sx.core.Producto
import sx.core.VentaDet


@GrailsCompileStatic
@EqualsAndHashCode(includes=['id'])
class EnvioDet {

    String id

    Envio envio

    VentaDet ventaDet

    Producto producto

    BigDecimal cantidad

    BigDecimal valor

    BigDecimal kilos

    String instruccionEntregaParcial

    Date dateCreated

    Date lastUpdated

    static  mapping ={
        id generator:'uuid'
    }

    static constraints = {
        instruccionEntregaParcial nullable: true
    }
}
