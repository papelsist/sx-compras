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
    BigDecimal tasaDepreciacion = 0.0
    BigDecimal montoOriginal = 0.0
    BigDecimal montoOriginalFiscal = 0.0
    BigDecimal depreciacionInicial = 0.0
    BigDecimal depreciacionAcumulada = 0.0
    BigDecimal remanente = 0.0

    BigDecimal ultimaDepreciacion = 0.0
    Date ultimaDepreciacionFecha

    BigDecimal inpcPrimeraMitad
    BigDecimal inpcDelMesAdquisicion

    BigDecimal ultimaDepreciacionFiscal
    Integer ultimaDepreciacionFiscalEjercicio

    Date depreciado
    
    String createUser
    String updateUser

    Date dateCreated
    Date lastUpdated

    static hasOne = [baja: BajaDeActivo]


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
        ultimaDepreciacion nullable: true
        ultimaDepreciacionFecha nullable: true

        inpcDelMesAdquisicion nullable: true, scale: 4
        inpcPrimeraMitad nullable: true, scale: 4
        baja nullable: true
        montoOriginalFiscal nullable: true
        depreciado nullable: true
    }

    static transients = {}

    static mapping = {
        table 'ACTIVO_FIJO2'
        adquisicion type:'date' , index: 'AF_IDX2'
        facturaFecha type: 'date'
        depreciacionAcumulada formula:'(select COALESCE(sum(x.depreciacion),0) from activo_depreciacion2 x where x.activo_fijo_id=id) '
        remanente formula: 'monto_original  - (select COALESCE(sum(x.depreciacion),0) from activo_depreciacion2 x where x.activo_fijo_id=id) '
        ultimaDepreciacion formula:'(select COALESCE( x.depreciacion, 0) from activo_depreciacion2 x where x.activo_fijo_id=id order by x.ejercicio, x.mes desc limit 1)'
        ultimaDepreciacionFecha formula:'(select max(x.corte) from activo_depreciacion2 x where x.activo_fijo_id=id)'
        ultimaDepreciacionFiscal formula:'(select COALESCE( x.depreciacion_fiscal, 0) from activo_depreciacion_fiscal x where x.activo_fijo_id=id order by x.ejercicio desc limit 1)'
        ultimaDepreciacionFiscalEjercicio formula:'(select max(x.ejercicio) from activo_depreciacion_fiscal x where x.activo_fijo_id=id)'
        depreciado type: 'date'
    }
    
}
