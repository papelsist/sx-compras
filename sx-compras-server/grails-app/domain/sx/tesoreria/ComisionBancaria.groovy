package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cxp.CuentaPorPagar

@EqualsAndHashCode(includes='id')
@ToString( excludes = "version, lastUpdated, dateCreated, cxc",includeNames=true,includePackage=false)
class ComisionBancaria {

    Date fecha

    CuentaDeBanco cuenta

    BigDecimal comision = 0.0

    BigDecimal impuestoTasa

    BigDecimal impuesto

    String concepto

    String comentario

    String referencia

    CuentaPorPagar cxp

    List<MovimientoDeCuenta> movimientos

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static hasMany = [movimientos:MovimientoDeCuenta]

    static constraints = {
        comentario nullable:true, maxSize: 200
        referencia nullable:true, maxSize: 100
        cxp nullable: true
        createUser nullable: true
        updateUser nullable: true
        concepto inList: [
                'POR_TRASFERENCIA', 'CHEQUES_GIRADOS', 'DIFERENCIA_COMISIONES', 'CHEQUE_CERTIFICADO',
                'COBU', 'ANUALIDAD', 'EXC_PAQ', 'IN_MDIA', 'SERV_BCA', 'TRANSFER_FONDOS', 'SPEI', 'OTROS']
    }

    static mapping ={
        fecha type:'date'
        movimientos cascade: "all-delete-orphan"
    }

}

