package sx.activo

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.contabilidad.CuentaContable
import sx.core.TipoDeCambio

@GrailsCompileStatic
@ToString(excludes ='id,version,dateCreated,lastUpdated,sw2,partidas',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id')
class ActivoFijo {

    // static hasMany = [partidas: RequisicionDet]
    Date fecha
    String facturaSerie
    String facturaFolio
    Date facturaFecha
    String uuid
    String descripcion
    String serie
    String modelo

    BigDecimal montoOriginal

    String tipo
    CuentaContable cuentaContable
    BigDecimal tasaDepreciacion

    BigDecimal depreciacionAcumulada
    BigDecimal remanente


    BigDecimal porcentajeDepreciado

    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated


    static constraints = {
        facturaSerie nullable: true
        facturaFolio nullable: true
        uuid nullable: true
        serie nullable: true
        modelo nullable: true
        cuentaContable nullable: true
        tasaDepreciacion scale: 4
    }

    static transients = {
        porcentajeDepreciado
    }

    static mapping = {
        partidas cascade: "all-delete-orphan"
        facturaFecha type:'date' , index: 'REQ_IDX2'
        fecha type:'date', index: 'REQ_IDX3'
    }
}
