package sx.core

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@ToString(includes='fecha, moneda, tipoDeCambio',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='fecha, moneda')
class TipoDeCambio {

    Date fecha
    String moneda = 'USD'
    BigDecimal tipoDeCambio
    String fuente = 'BANCO DE MEXICO'

    Date dateCreated
    Date lastUpdated

    static constraints = {
        fecha(nullable:false)
        tipoDeCambio(scale:6)
        fuente(maxSize:200)
    }

    static mapping = {
        fecha type:'date'
    }
}
