package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Proveedor
import sx.utils.MonedaUtils

/**
 * Created by rcancino on 19/04/17.
 */
@ToString(includes =   ['folio','nombre', 'total', 'aplicado'], includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'nombre', 'folio', 'serie'])
@GrailsCompileStatic
class Pago {

    String id

    Date fecha = new Date()

    Proveedor proveedor

    String nombre

    String folio

    String serie

    String moneda = MonedaUtils.PESOS.currencyCode

    String formaDePago

    BigDecimal tipoDeCambio = 1.0

    BigDecimal total = 0.0

    BigDecimal aplicado = 0.0

    BigDecimal diferencia = 0.0

    Date diferenciaFecha

    String diferenciaConcepto

    String comentario

    Long sw2

    List<AplicacionDePago> aplicaciones = []

    Date dateCreated
    Date lastUpdated
    String createUser
    String updateUser

    String uuid

    ComprobanteFiscal comprobanteFiscal

    Requisicion requisicion

    String egreso

    BigDecimal disponible = 0.0

    static constraints = {
        folio nullable: true, maxSize: 30
        serie nullable: true, maxSize: 30
        moneda maxSize: 5
        tipoDeCambio(scale:6)
        total(scale:4)
        uuid nullable:true, unique:true, maxSize: 50
        sw2 nullable:true
        comprobanteFiscal nullable: true
        comentario nullable: true
        diferenciaFecha nullable: true
        diferenciaConcepto nullable: true
        requisicion nullable: true
        egreso nullable: true
        formaDePago maxSize: 100

    }

    static mapping = {
        id generator:'uuid'
        fecha type:'date' ,index: 'CXP_APLICACION_IDX1'
        diferenciaFecha type: 'date'
        aplicado formula:'(select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.pago_id=id)'
        disponible formula:'total - diferencia - (select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.pago_id=id)'
    }

    static transients = ['aplicaciones']


    // static hasMany =[aplicaciones: AplicacionDePago]

    BigDecimal getDisponible() {
        return total - aplicado - diferencia
    }

    /*
    List<AplicacionDePago> getAplicaciones() {
        return AplicacionDePago.where{pago == this}.list()
    }
    */



}



