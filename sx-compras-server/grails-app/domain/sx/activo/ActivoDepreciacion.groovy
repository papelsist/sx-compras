package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.Sortable
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic

@Sortable(includes = ['ejercicio', 'mes'])
@ToString(includes ='ejercicio, mes, actualizacion, depreciacion',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='ejercicio, mes')
@GrailsCompileStatic
class ActivoDepreciacion {

    Integer ejercicio
    Integer mes
    ActivoFijo activoFijo

    Date actualizacion

    BigDecimal depreciacionAcumulada = 0.0
    BigDecimal remanente = 0.0
    BigDecimal tasaDepreciacion = 0.0
    BigDecimal porcentajeDepreciado = 0.0
    BigDecimal depreciacionContable = 0.0
    BigDecimal depreciacionTotal = 0.0
    BigDecimal saldo = 0.0
    BigDecimal ultimoInpc = 0.0
    BigDecimal inpc = 0.0
    BigDecimal factorDeActualizacion = 0.0
    BigDecimal depreciacionFiscal = 0.0
    BigDecimal depreciacion = 0.0


    static constraints = {
    }

    static belongsTo = [activoFijo: ActivoFijo]

    static mapping = {
        actualizacion type:'date'
    }
}
