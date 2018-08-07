package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.core.Proveedor

@ToString(excludes = ['id,version,sw2,dateCreated,lastUpdated'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true,includes = ['id', 'folio'])
@GrailsCompileStatic
class Contrarecibo {

    String id

    Long folio

    Date fecha = new Date()

    Proveedor proveedor

    BigDecimal total = 0.0

    String comentario

    String moneda = 'MXN'

    Date dateCreated

    Date lastUpdated

    String updateUser
    String createUser

    Long sw2

    List<CuentaPorPagar> cuentasPorPagar = []

    static  hasMany =[cuentasPorPagar: CuentaPorPagar]


    static constraints = {
        comentario nullable:true
        sw2 nullable:true
        moneda maxSize: 3
        updateUser nullable: true
        createUser nullable: true
    }

    static mapping = {
        id generator:'uuid'
        fecha type:'date' ,index: 'CRIBO_IDX1'
        proveedor index: 'CRIBO_IDX1'

    }


}
