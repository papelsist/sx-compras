package sx.contabilidad


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.utils.MonedaUtils

@EqualsAndHashCode(includes='ejercicio,mes,tipo,folio')
@ToString(includes='ejercicio,mes,tipo,subtipo,folio,debe,haber,fecha, sucursal',includeNames=true,includePackage=false)
class Poliza {

    Integer ejercicio

    Integer mes

    String tipo

    String subtipo

    Integer folio

    Date fecha

    String concepto

    BigDecimal debe = 0.00

    BigDecimal haber = 0.00

    boolean manual = false

    List<PolizaDet> partidas=[]

    Date cierre

    String egreso

    String sucursal  = 'OFICINAS'

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    Date satComplementos
    Date satComprobantes

    static hasMany = [partidas: PolizaDet]

    static constraints = {
        ejercicio inList:(2014..2030)
        mes inList:(1..13)
        tipo inList:['INGRESO','EGRESO','DIARIO']
        // subtipo minSize:5,maxSize:50, inList: SUBTIPOS
        // folio unique:['ejercicio','mes','subtipo']
        concepto maxSize:300
        cierre nullable:true
        createUser nullable: true
        updateUser nullable: true
        egreso nullable: true
        sucursal nullable: true
        satComplementos nullable: true
        satComprobantes nullable: true
        subtipo inList: [
                'INGRESOS_CON',
                'INGRESOS_COD',
                'INGRESOS_CRE',
                'INGRESOS_CHE',
                'INGRESOS_JUR',
                'COBRANZA_CON',
                'COBRANZA_COD',
                'COBRANZA_CRE',
                'COBRANZA_CHE',
                'COBRANZA_JUR',
                'CHEQUE',
                'CHEQUES',
                'TRANSFERENCIA',
                'TRANSFERENCIAS',
                'COMISIONES_TARJETA',
                'VENTAS_CON',
                'VENTAS_COD',
                'VENTAS_CRE',
                'VENTAS_ACF',
                'VENTAS_OTR',
                'NOTAS_DE_CARGO',
                'DESCUENTOS_COMPRAS',
                'TRASPASOS_CXC',
                'NOTAS_DE_CREDITO_DEV',
                'NOTAS_DE_CREDITO_BON',
                'ANTICIPOS','COMPRAS',
                'INVENTARIOS',
                'ACTIVO_FIJO',
                'CHEQUES_EN_TRANSITO',
                'DEPOSITOS_EN_TRANSITO',
                'DEPOSITOS_TESORERIA',
                'TESORERIA',
                'PROVISION_DE_GASTOS',
                'PROVISION_DE_REMBOLSO',
                'PROVISION_DE_FLETES',
                'PROVISION_DE_SEGUROS',
                'COMISIONES_BANCARIA_GASTO',
                'PROVISION_NOMINA',
                'PROVISION_DE_CARGA_SOCIAL',
                'VARIACION_CAMBIARIA',
                'IMPUESTOS_SOBRE_NOMINA',
                'TRASPASO_IVA',
                'CIERRE_ANUAL',
                'CIERRE_MENSUAL']
    }

    static mapping ={
        partidas cascade: "all-delete-orphan"
        fecha type:'date'
        satComplementos type:'date'
        satComprobantes type:'date'
    }

    static transients = {'cuadre'}

    def getCuadre(){
        return MonedaUtils.round(debe-haber)
    }




    BigDecimal getTotalNacionales() {
        return partidas*.getTotalNacionales().sum()
    }

    BigDecimal getTotalExtranjeros() {
        return partidas*.getTotalExtranjeros().sum()
    }

    public static SUBTIPOS =  [
            'INGRESOS_CON',
            'COBRANZA_CON',
            'COBRANZA_COD',
            'COBRANZA_CRE',
            'COBRANZA_CHE',
            'COBRANZA_JUR',
            'CHEQUE',
            'TRANSFERENCIA',
            'COMISIONES_TARJETA',
            'VENTAS_CON',
            'VENTAS_COD',
            'VENTAS_CRE',
            'VENTAS_ACF',
            'VENTAS_OTR',
            'NOTAS_DE_CARGO',
            'DESCUENTOS_COMPRAS',
            'TRASPASOS_CXC',
            'NOTAS_DE_CREDITO_DEV',
            'NOTAS_DE_CREDITO_BON',
            'ANTICIPOS','COMPRAS',
            'INVENTARIOS',
            'ACTIVO_FIJO',
            'CHEQUES_EN_TRANSITO',
            'DEPOSITOS_EN_TRANSITO',
            'DEPOSITOS_TESORERIA',
            'TESORERIA',
            'PROVISION_DE_GASTOS',
            'PROVISION_DE_REMBOLSO',
            'PROVISION_DE_FLETES',
            'PROVISION_DE_SEGUROS',
            'COMISIONES_BANCARIA_GASTO',
            'PROVISION_NOMINA',
            'PROVISION_DE_CARGA_SOCIAL',
            'VARIACION_CAMBIARIA',
            'IMPUESTOS_SOBRE_NOMINA',
            'CIERRE_ANUAL',
            'CIERRE_MENSUAL']

}

/**
 * fecha validator:{ val, obj ->
 *             int year = val.getAt(Calendar.YEAR)
 *             int month = val.getAt(Calendar.MONTH) + 1
 *             if(year == obj.ejercicio && month == obj.mes) {*                 return true
 *}
 *             return 'fechaFueraDe'
 *         }
 */


