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

    String cuenta
    String descripcion
    String descripcionActivo
    Date adquisicion
    BigDecimal montoOriginal
    BigDecimal montoOriginalFiscal
    BigDecimal tasa
    
    BigDecimal inpcPrimeraMitad = 0.0
    String inpcPrimeraMitadDesc
    BigDecimal inpcDelMesAdquisicion = 0.0
    BigDecimal factorDeActualizacion = 0.0
    BigDecimal depreciacionEjercicioAnterior = 0.0
    BigDecimal depreciacionDelEjercicio = 0.0
    BigDecimal depreciacionAcumulada = 0.0
    BigDecimal depreciacionFiscal = 0.0
    BigDecimal remanente = 0.0
    
    
    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static constraints = {
        createUser nullable: true
        updateUser nullable: true
        inpcDelMesAdquisicion scale: 4
        factorDeActualizacion scael: 4
        inpcPrimeraMitadDesc maxSize: 50
        tasa sacale: 4
    }
   
    static mapping = {
        adquisicion type: 'date'
    }

    
}
