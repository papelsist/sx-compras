package sx.cxp

class RequisicionDeCompras extends Requisicion{

    BigDecimal descuentof = 0.0
    BigDecimal descuentofImporte = 0.0
    Contrarecibo contrarecibo;

    static constraints = {
        descuentof scale: 4
        descuentofImporte nullable: true
        contrarecibo nullable: true
    }

}
