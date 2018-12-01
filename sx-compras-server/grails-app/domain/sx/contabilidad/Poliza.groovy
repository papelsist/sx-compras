package sx.contabilidad


import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.utils.MonedaUtils

@EqualsAndHashCode(includes='ejercicio,mes,tipo,folio')
@ToString(includes='ejercicio,mes,tipo,subtipo,folio,debe,haber,fecha',includeNames=true,includePackage=false)
class Poliza {

    Integer ejercicio

    Integer mes

    String tipo

    String subtipo

    Integer folio

    Date fecha

    String concepto

    BigDecimal debe = 0.0

    BigDecimal haber = 0.0

    boolean manual = false

    List partidas=[]

    Date cierre

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    static hasMany = [partidas:PolizaDet]

    static constraints = {
        ejercicio inList:(2014..2018)
        mes inList:(1..13)
        tipo inList:['INGRESO','EGRESO','DIARIO']
        subtipo minSize:5,maxSize:50
        folio unique:['ejercicio','mes','subtipo']
        debe scale:6
        haber scale:6
        concepto maxSize:300
        cierre nullable:true
        fecha validator:{ val, obj ->
            int year = val.getAt(Calendar.YEAR)
            int month = val.getAt(Calendar.MONTH) + 1
            if(year == obj.ejercicio && month == obj.mes) {
                return true
            }
            return 'fechaFueraDeEjercicio'
        }
        createUser nullable: true
        updateUser nullable: true
    }

    static mapping ={
        partidas cascade: "all-delete-orphan"
        fecha type:'date'
    }

    static transients = {'cuadre'}

    def getCuadre(){
        return MonedaUtils.round(debe-haber)
    }

    def actualizar(){
        debe = partidas.sum (0.0,{it.debe})
        haber = partidas.sum(0.0,{it.haber})
    }

    def beforeInsert(){
        actualizar()
    }

    def beforeUpdate(){
        actualizar()
    }

    static enum SubtipoIngreso {
        COBRANZA_CON,
        COBRANZA_COD,
        COBRANZA_CRE,
        COBRANZA_CHE,
        COBRANZA_JUR,
        INTERESES_PRESTAMO_CHOFERES,
        DEPOSITOS_TESORERIA,
    }

    static enum SubtipoEgreso {
        CHEQUE,
        TRANSFERENCIA,
        TARJETA
    }

    static enum SuttipoDiario {
        VENTAS,
        NOTAS_DE_CARGO,
        NOTAS_DE_CREDITO,
        ANTICIPOS,
        COMPRAS,
        DESCUENTOS_COMPRAS,
        INVENTARIOS,
        ACTIVO_FIJO,
        CHEQUES_EN_TRANSITO,
        DEPOSITOS_EN_TRANSITO,
        TESORERIA,
        PROVISION_DE_GASTOS,
        PROVISION_DE_CARGA_SOCIAL,
        CIERRE_ANUAL
    }

}



