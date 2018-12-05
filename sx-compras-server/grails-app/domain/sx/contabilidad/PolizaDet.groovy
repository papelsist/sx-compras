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

    Date dateCreated
    Date lastUpdated


    static belongsTo = [poliza:Poliza]

    //static hasOne = [cheque: PolizaCheque, transferencia: TransaccionTransferencia, compraNal: TransaccionCompraNal]

    static constraints = {
        concepto nullable:true
        descripcion nullable:true
        asiento nullable:true
        referencia nullable:true
        referencia2 nullable:true
        origen nullable:true
        entidad nullable:true
        documento nullable:true
        documentoTipo nullable:true
        documentoFecha nullable:true

        //cheque(nullable:true)
        //transferencia(nullable:true)
        //compraNal nullable:true


    }

    static  mapping = {
        documentoFecha type: 'date'
    }


}

