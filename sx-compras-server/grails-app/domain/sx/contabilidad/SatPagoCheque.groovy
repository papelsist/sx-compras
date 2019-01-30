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
class SatPagoCheque {

    String rfc

    String num

    String banEmisNal

    String ctaOri

    Date fecha

    String benef

    BigDecimal monto

    String banEmisExt

    SatMoneda moneda

    BigDecimal tipCamb

    static constraints = {
        banEmisExt nullable: true
        moneda nullable:true
        tipCamb nullable:true, scale: 4
    }
}
