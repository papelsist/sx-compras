package sx.inventario

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import sx.core.Inventario
import sx.core.Producto

@ToString(includes = 'producto, cantidad', includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = 'id, producto, inventario')
class TransformacionDet {

    String	id

    Inventario inventario

    Producto producto

    Transformacion transformacion

    TransformacionDet destino

    BigDecimal cantidad

    Long cortes

    String cortesInstruccion

    String comentario

    String sw2

    BigDecimal costo
    BigDecimal analizado
    BigDecimal pendienteDeAnalizar

    Date dateCreated
    Date lastUpdated



    static belongsTo = [transformacion:Transformacion]

    static constraints = {
        destino nullable: true
        cortesInstruccion nullable: true
        comentario nullable: true
        sw2 nullable: true
        dateCreated nullable: true
        lastUpdated nullable: true
        inventario nullable: true
        costo nullable: true
        analizado formula:'(select COALESCE(sum(x.cantidad),0) from analisis_de_transformacion_det x where x.trs_id=id)'
        pendienteDeAnalizar formula:'cantidad - (select COALESCE(sum(x.cantidad),0) from analisis_de_transformacion_det x where x.trs_id=id)'

    }


    static mapping ={
        id generator:'uuid'
        producto index:'PRODUCTO_IDX'

    }

}
