package sx.logistica

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode

@GrailsCompileStatic
@EqualsAndHashCode(includes=['id', 'documento'])
class ClienteDistribuidor {

    String cliente

    String clave

    String nombre

    BigDecimal precioTonelada

    String comentario

    Boolean activo

}
