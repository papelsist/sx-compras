package sx.cxp

import grails.compiler.GrailsCompileStatic
import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.contabilidad.CuentaContable
import sx.core.Proveedor
import sx.core.Sucursal
import sx.tesoreria.MovimientoDeCuenta

@ToString(excludes ='id,version,dateCreated,lastUpdated,requisicion',includeNames=true,includePackage=false)
@EqualsAndHashCode(includes='id, nombre, fecha, total')
@GrailsCompileStatic
class Rembolso {

    Sucursal sucursal

    Proveedor proveedor

    String nombre

    String concepto

    String moneda = 'MXN'

    BigDecimal tipoDeCambio = 1.0

    Date fecha

    Date fechaDePago

    String formaDePago = 'CHEQUE'

    BigDecimal total = 0.0

    BigDecimal apagar = 0.0

    List<RembolsoDet> partidas = []

    String comentario

    MovimientoDeCuenta egreso

    MovimientoDeCuenta comision

    Pago pago

    CuentaContable cuentaContable

    String createUser
    String updateUser
    Date dateCreated
    Date lastUpdated

    Long sw2

    static hasMany = [partidas: RembolsoDet]

    static constraints = {
        total scale:4
        apagar scale: 4
        tipoDeCambio scale: 6
        formaDePago inList:['TRANSFERENCIA','CHEQUE']
        comentario nullable:true
        sw2 nullable:true
        egreso nullable: true
        comision nullable: true
        pago nullable: true
        proveedor nullable: true
        cuentaContable nullable: true
        concepto inList: ['REMBOLSO','PAGO','GASTO','PRESTAMO','DEVOLUCION', 'ESPECIAL', 'NOTA']
    }
    /*
        concepto inList: ['PAGO',
                          'REMBOLSO',
                          'PAGO_TARJETA',
                          'PAGO_CONTABLE',
                          'CARGA_SOCIAL',
                          'PRESTAMO_CHOFER',
                          'PRESTAMO_EMPLEADO',
                          'PAGO_CHOFER',
                           'CUOTA_SINDICAL']
                           */

    static mapping = {
        partidas cascade: "all-delete-orphan"
        nombre index: 'REMBOLSO_IDX1'
        fechaDePago type:'date' , index: 'REQ_IDX2'
        fecha type:'date', index: 'REMBOLSO_IDX3'
    }
}
