package sx.contabilidad.fiscal

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.contabilidad.CuentaContable

@EqualsAndHashCode(includes = 'id, ejercicio, clave')
@ToString(includeNames = true, includePackage = false)
class AjusteAnualPorInflacionManual {

    Integer ejercicio
    
    AjustePorInflacionConcepto concepto

    BigDecimal enero = 0.0
    BigDecimal febrero = 0.0
    BigDecimal marzo = 0.0
    BigDecimal abril = 0.0
    BigDecimal mayo = 0.0
    BigDecimal junio = 0.0
    BigDecimal julio = 0.0
    BigDecimal agosto = 0.0
    BigDecimal septiembre = 0.0
    BigDecimal octubre = 0.0
    BigDecimal noviembre = 0.0
    BigDecimal diciembre = 0.0

    Date dateCreated
    Date lastUpdated

    static constraints = {
        concepto unique: ['ejercicio']
        createUser nullable: true
        updateUser nullable: true
    }
    

}
