package sx.contabilidad


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes = ['id'])
@ToString(includes = 'cuenta, debe, haber, concepto, asiento, referencia, entidad, origen', includeNames=true,includePackage=false)
class PolizaDet {

    CuentaContable cuenta

    BigDecimal debe = 0.0

    BigDecimal haber = 0.0

    String concepto

    String descripcion

    String asiento

    String referencia

    String referencia2

    String origen

    String entidad

    String documento
    String documentoTipo
    Date documentoFecha

    String sucursal

    //  Comprobantes
    String uuid
    String rfc
    BigDecimal montoTotal
    String moneda
    BigDecimal tipCamb

    BigDecimal montoTotalPago
    String beneficiario
    String metodoDePago
    String bancoOrigen
    String bancoDestino
    String ctaOrigen
    String ctaDestino
    String referenciaBancaria


    Date dateCreated
    Date lastUpdated


    List<SatPagoTransferencia> transferencias = []

    List<SatPagoCheque> cheques = []

    List<SatPagoOtro> otros = []

    static belongsTo = [poliza:Poliza]


    // static hasMany = []


    static constraints = {
        descripcion nullable:true
        asiento nullable:true
        referencia nullable:true
        referencia2 nullable:true
        origen nullable:true
        entidad nullable:true
        documento nullable:true
        documentoTipo nullable:true
        documentoFecha nullable:true
        uuid nullable: true
        rfc nullable: true
        montoTotal nullable: true
        moneda nullable: true
        tipCamb nullable: true, scale: 5
        //
        beneficiario nullable: true
        metodoDePago nullable: true
        bancoOrigen nullable: true
        bancoDestino nullable: true
        ctaOrigen nullable: true
        ctaDestino nullable: true
        referenciaBancaria nullable: true
        montoTotalPago nullable: true
    }

    static  mapping = {
        documentoFecha type: 'date'
        // otros cascade: "all-delete-orphan", lazy: false

    }

    // static transients = ['nacionales, otros, extranjeros,cheques,transferencias']



}

