package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Sucursal
import sx.tesoreria.CuentaDeBanco


@ToString(includes = "folio, sucursal, origen, cuentaDeBanco,total",includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = 'id,folio')
class Ficha {

    String id

    Long folio = 0

    Sucursal sucursal

    String origen

    Date fecha

    BigDecimal total = 0.0

    CuentaDeBanco cuentaDeBanco

    String tipoDeFicha

    Date fechaCorte

    Date cancelada

    String ingreso

    String comentario

    Boolean	envioValores	 = true

    String sw2

    Date dateCreated

    Date lastUpdated

    static constraints = {
        sw2 nullable: true
        origen inList: ['CON','COD','CRE','CAM','CHE','JUR']
        comentario nullable: true
        tipoDeFicha inList:['EFECTIVO', 'OTROS_BANCOS', 'MISMO_BANCO']
        ingreso nullable:true
        cancelada nullable: true
        fechaCorte nullable: true
    }

    static mapping ={
        id generator: 'uuid'
        fecha type:'date' , index: 'FICHA_IDX1'
        sucursal index: 'FICHA_IDX1'
    }
}
