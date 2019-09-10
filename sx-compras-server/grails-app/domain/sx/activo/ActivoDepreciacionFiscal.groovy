package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.Sortable
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic


@ToString(includes ='ejercicio, mes, depreciacionContable', includeNames=true, includePackage=false)
@EqualsAndHashCode(includes='id, ejercicio')
@GrailsCompileStatic
class ActivoDepreciacionFiscal {

    Integer ejercicio
    ActivoFijo activoFijo
    
    BigDecimal inpcPrimeraMitad = 0.0
    BigDecimal inpcDelMesAdquisicion = 0.0
    BigDecimal factorDeActualizacion = 0.0
    BigDecimal depreciacionAcumulada = 0.0
    BigDecimal depreciacionFiscal = 0.0
    
    
    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        createUser nullable: true
        updateUser nullable: true
        inpcDelMesAdquisicion scale: 4
        factorDeActualizacion scael: 4
    }
   
    static mapping = {
    }

    
}
