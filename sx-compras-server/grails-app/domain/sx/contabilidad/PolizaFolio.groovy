package sx.contabilidad

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

@EqualsAndHashCode(includes='ejercicio,mes,tipo,folio')
@ToString(includes='ejercicio,mes,subTipo,folio',includeNames=true,includePackage=false)
class PolizaFolio {

    Integer ejercicio

    Integer mes

    String tipo

    String subtipo

    Integer folio = 0

    Date dateCreated

    Date lastUpdated

    static constraints = {
        subtipo maxSize:50
        tipo maxSize:50
        mes inList:(1..13)
        folio nullable:false, unique:['tipo', 'subtipo','mes','ejercicio']
    }

    static  mapping = {}



}

