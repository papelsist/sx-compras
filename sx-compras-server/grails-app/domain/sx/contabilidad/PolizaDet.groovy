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

    String updateUser
    String createUser


    static belongsTo = [poliza:Poliza]

    //static hasOne = [cheque: PolizaCheque, transferencia: TransaccionTransferencia, compraNal: TransaccionCompraNal]

    static constraints = {
        concepto nullable:true
        descripcion nullable:true
        asiento nullable:true, maxSize:20
        referencia nullable:true
        referencia2 nullable:true
        origen nullable:true, maxSize:20
        entidad nullable:true, maxSize:50
        documento nullable:true, maxSize:50
        documentoTipo nullable:true, maxSize:50
        documentoFecha nullable:true

        //cheque(nullable:true)
        //transferencia(nullable:true)
        //compraNal nullable:true
    }

    static  mapping = {
        documentoFecha type: 'date'
    }


}

