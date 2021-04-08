package sx.costos

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Producto

@ToString(includes = ['ejercicio','mes' ,'clave','costo'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'ejercicio', 'mes', 'clave'])
@GrailsCompileStatic
class CostoPromedio {

    Integer ejercicio
    Integer mes
    Producto producto
    String clave
    String descripcion
    BigDecimal costoAnterior
    BigDecimal costo
    BigDecimal diferencia
    BigDecimal diferenciaImporte

    Date dateCreated
    Date lastUpdated

    static constraints = {
        ejercicio min: 2010, max: 2030
        mes inList: [1,2,3,4,5,6,7,8,9,10,11,12]
        producto unique: ['ejercicio', 'mes']
    }

    static transients = ['diferencia', 'diferenciaImporte']

    BigDecimal  getDiferencia() {
        if(costo)
            return 1.0 - (costoAnterior / costo)
        else return 0
    }

    BigDecimal getDiferenciaImporte() {
        return costo - costoAnterior
    }
}
