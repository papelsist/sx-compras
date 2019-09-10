package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.Sortable
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic


@ToString(includes ='ejercicio, mes, depreciacionContable',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, ejercicio, mes')
@GrailsCompileStatic
class ActivoDepreciacion implements  Comparable<ActivoDepreciacion>{

    Integer ejercicio
    Integer mes
    ActivoFijo activoFijo
    Date corte

    BigDecimal tasaDepreciacion = 0.0

    BigDecimal depreciacionAcumulada = 0.0
    BigDecimal depreciacion = 0.0
    
    
    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        createUser nullable: true
        updateUser nullable: true
    }
   
    static mapping = {
        table 'ACTIVO_DEPRECIACION2'
        corte type:'date'
    }

    @Override
    int compareTo(ActivoDepreciacion other) {
        return this.ejercicio == other.ejercicio ?
                this.mes.compareTo(other.mes) :
                this.ejercicio.compareTo(other.ejercicio)
    }
}
