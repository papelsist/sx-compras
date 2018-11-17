package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import groovy.transform.ToString
import groovy.transform.EqualsAndHashCode
import sx.core.Proveedor
import sx.cxp.CuentaPorPagar


// @GrailsCompileStatic
@EqualsAndHashCode(includes='id')
@ToString(includeNames=true,includePackage=false, includes = ['cuentaOrigen', 'cuentaDestino', 'importe'])
class CompraDeMoneda {

    Date fecha

    CuentaDeBanco cuentaOrigen

    CuentaDeBanco cuentaDestino

    String moneda = 'USD'

    BigDecimal importe
    BigDecimal apagar
    String formaDePago
    BigDecimal tipoDeCambio
    BigDecimal tipoDeCambioCompra
    BigDecimal diferenciaCambiaria

    Proveedor proveedor
    String afavor

    List<MovimientoDeCuenta> movimientos

    CuentaPorPagar cxp

    String referencia

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    Long sw2

    static hasMany = [movimientos:MovimientoDeCuenta]


    static constraints = {
        /*
        cuentaDestino validator:{val, obj ->
            if(obj.cuentaOrigen==val)
                return "mismaCuentaError"
            if(obj.cuentaOrigen.moneda!=obj.moneda)
                return "diferenteMonedaError"

        }
        */
        createUser nullable: true
        updateUser nullable: true
        referencia nullable: true
        cxp nullable: true
        sw2 nullable: true
    }



    static mapping ={
        fecha type: 'date'
        movimientos cascade: "all-delete-orphan"
    }


}
