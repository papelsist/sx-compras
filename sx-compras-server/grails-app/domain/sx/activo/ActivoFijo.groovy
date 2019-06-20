package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic

import sx.contabilidad.CuentaContable
import sx.cxp.ConceptoDeGasto

@GrailsCompileStatic
@ToString(includes ='id, facturaSerie, facturaFolio, facturaFecha',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, facturaSerie, facturaFolio, facturaFecha')
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

    ConceptoDeGasto conceptoDeGasto
    Integer renglon
    String proveedor

    String sucursalOrigen
    String sucursalActual
    String departamentoOrigen
    String departamentoActual
    String consignatario
    String estado


    String tipo
    CuentaContable cuentaContable
    BigDecimal tasaDepreciacion

    BigDecimal montoOriginal
    BigDecimal costoActualizado

    BigDecimal depreciacionAcumulada
    BigDecimal remanente

    String venta
    String ventaFactura
    String ventaFecha
    BigDecimal ventaImporte


    BigDecimal porcentajeDepreciado

    SortedSet<ActivoDepreciacion> depreciaciones

    String comentario

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
        conceptoDeGasto nullable: true
        estado inList: ['VIGENTE', 'DEPRECIADO', 'VENDIDO']
        sucursalOrigen nullable: true
        sucursalActual nullable: true
        departamentoOrigen nullable: true
        departamentoActual nullable: true
        consignatario nullable: true
        renglon nullable: true
        comentario nullable: true
    }

    static transients = {
        porcentajeDepreciado
    }

    static mapping = {
        depreciaciones cascade: "all-delete-orphan"
        fecha type:'date', index: 'AF_IDX1'
        facturaFecha type:'date' , index: 'AF_IDX2'

    }
}
