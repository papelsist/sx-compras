package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.TupleConstructor

@TupleConstructor
@GrailsCompileStatic
@EqualsAndHashCode
@ToString
class SatComprobanteExt {


    String numFactExt

    String taxID

    BigDecimal montoTotal

    String moneda

    BigDecimal tipCamb

    static constraints = {
        taxID nullable: true
        moneda nullable:true
        tipCamb nullable:true, scale: 4
    }

}
