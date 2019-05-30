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
class NotaDeCreditoCxP {

    String id

    Date fecha = new Date()

    Proveedor proveedor

    String nombre

    String folio

    String serie

    String uuid

    String moneda = MonedaUtils.PESOS.currencyCode

    BigDecimal tipoDeCambio = 1.0

    BigDecimal tcContable = 0.0

    BigDecimal subTotal = 0.0

    BigDecimal descuento = 0.0

    BigDecimal impuestoTrasladado = 0.0

    BigDecimal impuestoRetenido = 0.0

    BigDecimal total = 0.0

    BigDecimal aplicado = 0.0

    String comentario

    Long sw2

    List<NotaDeCreditoCxPDet> conceptos = []

    List<AplicacionDePago> aplicaciones = []

    Date dateCreated

    Date lastUpdated

    String concepto

    ComprobanteFiscal comprobanteFiscal

    String tipoDeRelacion

    BigDecimal diferencia = 0.0
    Date diferenciaFecha

    BigDecimal disponibleReal



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
        uuid nullable:true, unique:true, maxSize: 50
        sw2 nullable:true
        comprobanteFiscal nullable: true
        comentario nullable: true
        tipoDeRelacion nullable: true ,maxSize: 10
        tcContable nullable: true
        diferencia nullable: true
        diferenciaFecha nullable: true
    }

    static mapping = {
        id generator:'uuid'
        conceptos cascade: "all-delete-orphan"
        fecha type:'date' ,index: 'CXP_APLICACION_IDX1'
        concepto inList: ['DEVOLUCION','DESCUENTO','DESCUENTO_FINANCIERO', 'DESCUENTO_ANTICIPO', 'BONIFICACION']
        aplicado formula:'(select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.nota_id=id)'
        disponibleReal formula:'total - (select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.nota_id=id) - diferencia'
        diferenciaFecha type: 'date'
    }

    static transients = ['disponible', 'aplicaciones']

    static hasMany =[conceptos: NotaDeCreditoCxPDet]

    BigDecimal getDisponible() {
        return total  - aplicado - diferencia?: 0.0
    }

    List<AplicacionDePago> getAplicaciones() {
        return AplicacionDePago.where{nota == this}.list()
    }



}



