package sx.cxp

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString


import sx.core.Proveedor

@ToString(includeNames=true,includePackage=false, includes = 'nombre, serie, folio, fecha ,total, uuid')
@EqualsAndHashCode(includeFields = true,includes = 'id, uuid')
class CuentaPorPagar {

    String id

    Proveedor proveedor

    String nombre

    String tipo

    String folio

    String serie

    Date fecha

    Date vencimiento

    String moneda = Currency.getInstance('MXN').currencyCode
    BigDecimal tipoDeCambio = 1.0
    BigDecimal tcContable = 0.0

    //Importes
    BigDecimal subTotal = 0.0
    BigDecimal descuento = 0.0
    BigDecimal impuestoTrasladado = 0.0
    BigDecimal impuestoRetenido = 0.0
    BigDecimal impuestoRetenidoIva = 0.0
    BigDecimal impuestoRetenidoIsr = 0.0
    BigDecimal total = 0.0

    BigDecimal descuentoFinanciero
    Date descuentoFinancieroVto

    String uuid

    String comentario

    Boolean analizada = false
    BigDecimal importePorPagar = 0.0

    Date dateCreated
    Date lastUpdated

    String createUser
    String updateUser

    String sw2

    String analisis

    ComprobanteFiscal comprobanteFiscal

    BigDecimal pagos = 0.0
    BigDecimal compensaciones = 0.0

    Long contrarecibo

    BigDecimal saldoReal

    BigDecimal diferencia = 0.0

    Date diferenciaFecha;

    static constraints = {
        tipo inList:['COMPRAS', 'GASTOS', 'HONORARIOS', 'COMISIONES']
        folio nullable: true, maxSize: 255
        serie nullable: true, maxSize: 30
        moneda maxSize: 5
        tipoDeCambio(scale:6)
        subTotal(scale:4)
        descuento(scale: 4)
        impuestoTrasladado nullable: true, scale:4
        impuestoRetenido nullable: true, sacle:4
        impuestoRetenidoIsr nullable: true
        impuestoRetenidoIva nullable: true
        total(scale:4)
        comentario(nullable:true)
        /*
        vencimiento (validator: { vencimiento, cxp ->
            if( (vencimiento <=> cxp.fecha) < 0 )
                return "vencimientoInvalido"
            else return true
        })
        */
        descuentoFinanciero nullable:true
        descuentoFinancieroVto nullable:true
        uuid nullable:true, unique:true
        sw2 nullable:true
        comprobanteFiscal nullable: true
        tcContable nullable: true
        contrarecibo nullable: true
        diferenciaFecha nullable: true
    }

    static mapping ={
        id generator:'uuid'
        fecha type:'date' , index: 'CXP_IDX2'
        vencimiento type:'date', index: 'CXP_IDX2'
        descuentoFinancieroVto type:'date'
        pagos formula:'(select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.cxp_id=id and x.pago_id is not null)'
        compensaciones formula:'(select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.cxp_id=id and x.nota_id is not null)'
        //saldoReal formula:'total - (select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.cxp_id=id and x.pago_id is not null) - diferencia'
        saldoReal formula:'total - (select COALESCE(sum(x.importe),0) from aplicacion_de_pago x where x.cxp_id=id) - diferencia'
        diferenciaFecha type: 'date'
    }


    static transients = [ 'saldo','analisis']

    BigDecimal toPesos(String property){
        return "${property}" * tipoDeCambio

    }

    BigDecimal getSaldo() {
        return this.total - this.pagos - this.compensaciones - this.diferencia
    }

    String getAnalisis() {
        return AnalisisDeFactura.where{ factura == this}.find()?.id
    }


}
