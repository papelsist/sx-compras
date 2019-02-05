package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import groovy.transform.TupleConstructor

@TupleConstructor
@GrailsCompileStatic
@EqualsAndHashCode
@ToString
class SatComprobanteNac {

    String uuidcfdi

    String rfc

    BigDecimal montoTotal

    String moneda

    BigDecimal tipCamb

    // static belongsTo = [polizaDet: PolizaDet]

    static constraints = {
        moneda nullable:true
        tipCamb nullable:true, scale: 4
    }

}
