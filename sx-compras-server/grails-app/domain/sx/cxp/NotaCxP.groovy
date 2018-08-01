package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Proveedor
import sx.utils.MonedaUtils

/**
 * Created by rcancino on 19/04/17.
 */
@ToString(excludes =  ['version','lastUpdated', 'dateCreated'], includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'nombre', 'folio', 'serie'])
@GrailsCompileStatic
class NotaCxP {

    Date fecha = new Date()

    Proveedor proveedor

    String nombre

    String folio

    String serie

    String moneda = MonedaUtils.PESOS.currencyCode

    BigDecimal tipoDeCambio = 1.0

    BigDecimal subTotal = 0.0

    BigDecimal descuento = 0.0

    BigDecimal impuestoTrasladado = 0.0

    BigDecimal impuestoRetenido = 0.0

    BigDecimal total = 0.0

    String comentario

    Long sw2

    Date dateCreated

    Date lastUpdated

    Tipo concepto = Tipo.DESCUENTO

    ComprobanteFiscal comprobante

    static constraints = {
        folio nullable: true, maxSize: 30
        serie nullable: true, maxSize: 30
        moneda maxSize: 5
        tipoDeCambio(scale:6)
        subTotal(scale:4)
        descuento(scale: 4)
        impuestoTrasladado(scale:4)
        impuestoRetenido(sacle:4)
        total(scale:4)
        comprobante nullable:true, unique:true
    }

}

enum Tipo {
    DEVLUCION
    ,DESCUENTO_FINANCIERO
    ,DESCUENTO
    ,DESCUENTO_ANTICIPO
    ,BONIFICACION
}
