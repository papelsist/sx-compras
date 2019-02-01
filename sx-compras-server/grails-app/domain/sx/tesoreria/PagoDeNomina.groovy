package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='id')
@ToString( excludes = "version, lastUpdated, dateCreated",includeNames=true,includePackage=false)
class PagoDeNomina {

    Long nomina
    String tipo
    String periodicidad
    String formaDePago

    Long folio

    BigDecimal total
    Date pago

    Integer ejercicio

    Long empleados
    Long nominaEmpleado
    Long empleadoId
    String empleado
    String afavor
    boolean pensionAlimenticia

    MovimientoDeCuenta egreso

    String referencia

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        nominaEmpleado unique: ['tipo', 'pensionAlimenticia']
        empleadoId nullable: true
        egreso nullable: true
        createUser nullable: true
        updateUser nullable: true

    }

    static transients = ['referencia']

    static mapping ={
        pago type:'date'
    }

    String getReferencia() {
        if(egreso) {
            if(formaDePago == 'CHEQUE') {
                return "CH: ${egreso?.cheque?.folio}"
            } else {
                return egreso?.referencia
            }
        }
        return null
    }

}

