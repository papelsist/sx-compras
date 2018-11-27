package sx.tesoreria

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


/**
 * Entidad que agrupa los movimientos de bancos  agenos a las operaciones basicas de la empresa
 * como pueden ser Aclaraciones,Conciliaciones,Faltantes Sobrantes
 *
 * Created by rcancino on 06/04/17.
 */
// @GrailsCompileStatic
@EqualsAndHashCode(includes='id, concepto, cuenta, importe')
@ToString(includeNames=true,includePackage=false, includes = ['fecha', 'cuenta', 'concepto', 'importe'])
class MovimientoDeTesoreria {

    Date fecha

    ConceptoTesoreria concepto

    BigDecimal importe

    CuentaDeBanco cuenta

    MovimientoDeCuenta movimiento

    String referencia

    String comentario

    String cuentaContable

    Date dateCreated
    Date lastUpdated

    String updateUser
    String createUser

    Long sw2

    static constraints = {
        comentario nullable: true
        referencia nullable: true
        createUser nullable: true
        updateUser nullable: true
        sw2 nullable: true
        cuentaContable nullable: true
    }

    static mapping = {
        fecha type: 'date'
    }
}

enum ConceptoTesoreria {
    DEPOSITO,
    DEP_PENDIENTE_ACLARAR,
    DIFDEPOSITOSABONO,
    DIFCONCILIACIONA,
    ABONO_SOBRANTE,
    CARGO,
    DIFDEPOSITOSCARGO,
    DIFCONCILIACIONC,
    CARGO_FALTANTE
}

