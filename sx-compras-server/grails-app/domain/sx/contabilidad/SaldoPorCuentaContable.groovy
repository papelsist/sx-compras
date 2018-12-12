package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


@EqualsAndHashCode(includes='id, ejercicio, mes, clave')
@ToString(includes = 'cuenta, ejercicio, mes, saldoInicial, debe, haber, saldoFinal', includeNames=true,includePackage=false)
class SaldoPorCuentaContable {

    CuentaContable cuenta

    String clave

    Integer ejercicio

    Integer mes

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
        cierre type: 'date'
    }

}
