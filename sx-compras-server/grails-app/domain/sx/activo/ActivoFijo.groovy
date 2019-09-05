package sx.activo

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic

import sx.contabilidad.CuentaContable
import sx.cxp.GastoDet
import sx.core.Proveedor

@GrailsCompileStatic
@ToString(includes ='id, descripcion, modelo, serie',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id')
class ActivoFijo {
    
    // Datos generales
    Date adquisicion
    String descripcion
    String serie
    String modelo

    // Factura orignal
    String facturaSerie
    String facturaFolio
    Date facturaFecha
    String uuid

    // Clasificacion
    String estado
    CuentaContable cuentaContable

    // Origen
    GastoDet gastoDet
    Proveedor proveedor

    // Consignatario
    String sucursalOrigen
    String sucursalActual
    String departamentoOrigen
    String departamentoActual
    String consignatario

    // Importes generales
    BigDecimal montoOriginal = 0.0
    BigDecimal tasaDepreciacion = 0.0

    BigDecimal depreciacionAcumulada = 0.0
    BigDecimal depreciacionInicial = 0.0

    
    
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
        

        createUser nullable: true
        updateUser nullable: true
    }

    static transients = {}

    static mapping = {
        table 'ACTIVO_FIJO2'
        adquisicion type:'date' , index: 'AF_IDX2'
        facturaFecha type: 'date'
    }
    
}
