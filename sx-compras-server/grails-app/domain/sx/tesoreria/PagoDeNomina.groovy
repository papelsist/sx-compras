package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cxp.CuentaPorPagar

@EqualsAndHashCode(includes='id')
@ToString( excludes = "version, lastUpdated, dateCreated",includeNames=true,includePackage=false)
class PagoDeNomina {

    Long nomina
    String tipo
    String periodicidad
    String formaDePago

    // Long folio

    BigDecimal total
    Date pago

    Integer ejercicio
    Integer mes  // ? string
    Date fechaInicial
    Date fechaFinal

    Long numeroDeEmpleado
    Long nominaEmpleado
    Long empleadoId
    String nombre // empleado
    Boolean pensionAlimenticia

    MovimientoDeCuenta egreso

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        numeroDeEmpleado nullable: true
        nominaEmpleado nullable: true
        empleadoId nullable: true
        pensionAlimenticia nullable: true
        egreso nullable: true

        createUser nullable: true
        updateUser nullable: true

    }

    static mapping ={
        pago type:'date'
    }

}

