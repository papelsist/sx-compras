package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@GrailsCompileStatic
@ToString(includes =  ['tipo', 'formaDePago', 'importe', 'comentario'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'cxp', 'tipo'])
class AplicacionDePago {

    String id

    Date fecha

    String formaDePago

    NotaDeCreditoCxP nota

    Pago pago

    CuentaPorPagar cxp

    BigDecimal importe

    String comentario

    Date dateCreated

    Date lastUpdated

    String tipo

    static constraints = {
        comentario nullable:true
        nota nullable: true
        pago nullable: true
    }

    static  mapping = {
        id generator:'uuid'
        fecha type: 'date'
        formaDePago size: 5..15
    }

    static transients = ['tipo']

    String getTipo() {
        return this.nota ? 'NOTA' : 'PAGO'
    }
}
