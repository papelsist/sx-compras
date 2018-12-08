package sx.tesoreria

import grails.compiler.GrailsCompileStatic

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import sx.cxp.Requisicion


@ToString(includes = ['cuenta','afavor','fecha', 'importe'],includeNames=true,includePackage=false)
@EqualsAndHashCode(includeFields = true, includes = ['id', 'cuenta', 'fecha', 'referencia', 'concepto', 'importe'])
@GrailsCompileStatic
class MovimientoDeCuenta {

    String id

    CuentaDeBanco cuenta

    String afavor

    Date fecha

    String formaDePago

    String tipo

    String referencia

    String concepto

    BigDecimal importe

    Currency moneda = Currency.getInstance('MXN')

    BigDecimal tipoDeCambio = 1.0

    String comentario

    String conceptoReporte

    Long sw2

    Date dateCreated

    Date lastUpdated

    String createUser
    String updateUser

    Cheque cheque

    String sucursal

    boolean porIdentificar = false

    static belongsTo = [
            movimientoDeTesoreria: MovimientoDeTesoreria,
            requisicion: Requisicion,
            pagoNomina: PagoDeNomina,
            pagoDeMorralla: PagoDeMorralla,
            devolucionCliente: DevolucionCliente,
            ficha: Ficha
    ]
    static mappedBy = [ pagoDeMorralla: "none"]


    static constraints = {
        tipoDeCambio scale:6
        formaDePago maxSie: 20
        tipo maxSie: 15
        concepto maxSie:20
        importe scale:4
        referencia nullable: true
        comentario nullable: true
        concepto nullable:true,maxSize:50
        sw2 nullable:true
        createUser nullable: true
        updateUser nullable: true
        cheque nullable: true, unique: true
        sucursal nullable: true
        movimientoDeTesoreria nullable: true
        requisicion nullable: true
        pagoNomina nullable: true
        pagoDeMorralla nullable: true
        devolucionCliente nullable: true
        ficha nullable: true
        conceptoReporte nullable: true
        porIdentificar nullable: true
    }

    static mapping ={
        id generator: 'uuid'
        fecha type:'date' , index: 'MOV_CTA_IDX1'
        afavor index: 'MOV_CTA_IDX2'
        formaDePago index: 'MOV_CTA_IDX3'
    }


    String toString(){
        return "${cuenta}  (${fecha.format('dd/MM/yyyy')}) ${importe}"
    }
}
