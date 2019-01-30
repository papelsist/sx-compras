package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.TupleConstructor
import lx.econta.SatMoneda

@TupleConstructor
@GrailsCompileStatic
@EqualsAndHashCode
@ToString
class SatPagoOtro {

    String metPagoPol

    Date fecha

    String benef

    String rfc

    BigDecimal monto

    SatMoneda moneda

    BigDecimal tipCamb

    static constraints = {
        moneda nullable:true
        tipCamb nullable:true, scale: 4
    }
}
