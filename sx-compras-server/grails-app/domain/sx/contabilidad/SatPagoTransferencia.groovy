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
class SatPagoTransferencia {


    String ctaOri


    String bancoOriNal


    String bancoOriExt


    String ctaDest


    String bancoDestNal


    String bancoDestExt


    String benef


    String rfc


    Date fecha


    BigDecimal monto


    SatMoneda moneda


    BigDecimal tipCamb

    static constraints = {
        ctaOri nullable: true
        bancoOriExt nullable: true
        moneda nullable:true
        tipCamb nullable:true, scale: 4
    }
}
