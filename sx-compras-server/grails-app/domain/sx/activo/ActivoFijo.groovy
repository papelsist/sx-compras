package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic

import sx.contabilidad.CuentaContable
import sx.cxp.GastoDet
import sx.core.Proveedor

@GrailsCompileStatic
@ToString(includes ='id, facturaSerie, facturaFolio, facturaFecha',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, facturaSerie, facturaFolio, facturaFecha, serie, modelo')
class ActivoFijo {

    Date fecha
    String facturaSerie
    String facturaFolio
    Date facturaFecha
    String uuid
    String descripcion
    String serie
    String modelo

    GastoDet gastoDet
    Proveedor proveedor

    String sucursalOrigen
    String sucursalActual
    String departamentoOrigen
    String departamentoActual
    String consignatario
    String estado


    String tipo = 'VIGENTE'
    CuentaContable cuentaContable
    BigDecimal tasaDepreciacion = 0.0

    BigDecimal montoOriginal = 0.0
    BigDecimal costoActualizado = 0.0

    BigDecimal depreciacionAcumulada = 0.0
    BigDecimal remanente = 0.0

    String venta
    String ventaFactura
    String ventaFecha
    BigDecimal ventaImporte


    BigDecimal porcentajeDepreciado

    String comentario

    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated


    static constraints = {
        proveedor nullable: true
        facturaSerie nullable: true
        facturaFolio nullable: true
        facturaFecha nullable: true
        uuid nullable: true

        serie nullable: true
        modelo nullable: true
        cuentaContable nullable: true
        tasaDepreciacion scale: 4
        gastoDet nullable: true

        estado inList: ['VIGENTE', 'DEPRECIADO', 'VENDIDO']
        sucursalOrigen nullable: true
        sucursalActual nullable: true
        departamentoOrigen nullable: true
        departamentoActual nullable: true
        consignatario nullable: true
        comentario nullable: true

        tipo nullable: true

        venta nullable: true
        ventaFecha nullable: true
        ventaFactura nullable: true
        ventaImporte nullable: true
    }

    static transients = {
        porcentajeDepreciado
    }

    static mapping = {
        table 'ACTIVO_FIJO2'
        fecha type:'date', index: 'AF_IDX1'
        facturaFecha type:'date' , index: 'AF_IDX2'

    }
    
}
