package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.inventario.TransformacionDet

@ToString(includes = 'clave, descripcion, cantdad, importe',includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'trs'])
class AnalisisDeTransformacionDet {

    AnalisisDeTransformacion analisis

    TransformacionDet trs

    String sucursal

    Long trsFolio

    Date trsFecha

    String clave

    String descripcion

    String unidad
    
    BigDecimal cantidad = 0.0

    BigDecimal kilos = 0.0

    BigDecimal participacion = 0.0

    BigDecimal importe = 0.0

    BigDecimal costo = 0.0

    Date dateCreated
    Date lastUpdated
    

    static belongsTo = [analisis: AnalisisDeTransformacion]

    static constraints = {
        clave maxSize:15
        participacion scale: 6
    }

    static mapping = {}


}
