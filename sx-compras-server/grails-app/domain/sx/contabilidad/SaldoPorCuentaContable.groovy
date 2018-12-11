package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='clave')
@ToString(includes = 'cuenta, ejercicio, mes, saldoFinal', includeNames=true,includePackage=false)
class SaldoPorCuentaContable {

    CuentaContable cuenta

    String clave

    Integer ejercicio

    Integer mes

    Date fecha

    BigDecimal debe

    BigDecimal haber

    BigDecimal saldoInicial

    BigDecimal saldoFinal

    Date cierre

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        debe nullable:false, scale:6
        haber nullable:false, scale:6
        saldoInicial nullable:false, scale:6
        saldoFinal nullable:false, scale:6
        createUser nullable: true
        updateUser nullable: true
        cierre nullable: true
    }

    static mapping ={
        fecha type: 'date'
        cierre type: 'date'
    }

}
