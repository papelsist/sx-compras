package sx.contabilidad


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode
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

    String uuid
    String rfc
    BigDecimal montoTotal
    String moneda
    BigDecimal tipCamb

    Date dateCreated
    Date lastUpdated



    List<SatComprobanteNac> nacionales = []

    List<SatComprobanteExt> extranjeros = []

    List<SatPagoTransferencia> transferencias = []

    List<SatPagoCheque> cheques = []

    List<SatPagoOtro> otros = []

    static belongsTo = [poliza:Poliza]


    static hasMany = [
        //
        // extranjeros: SatComprobanteExt,
        // transferencias: SatPagoTransferencia,
        // cheques: SatPagoCheque,
        // nacionales: SatComprobanteNac,
        otros: SatPagoOtro
    ]


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
        tipCamb nullable: true
    }

    static  mapping = {
        documentoFecha type: 'date'
        /*
        nacionales cascade: "all-delete-orphan", lazy: false
        extranjeros cascade: "all-delete-orphan"
        cheques cascade: "all-delete-orphan"
        transferencias cascade: "all-delete-orphan"
        */
        otros cascade: "all-delete-orphan", lazy: false


    }

    static transients = ['nacionales, otros, extranjeros,cheques,transferencias']

    BigDecimal getTotalNacionales() {
        def nacional =  nacionales.sum 0.0, {it.montoTotal}
        return nacional as BigDecimal
    }

    BigDecimal getTotalExtranjeros() {
        def ext =  extranjeros.sum 0.0, {it.montoTotal}
        return ext as BigDecimal
    }

}

