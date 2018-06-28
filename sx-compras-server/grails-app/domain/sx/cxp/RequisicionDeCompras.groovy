package sx.cxp

class RequisicionDeCompras extends Requisicion{

    BigDecimal descuentoFinanciero = 0.0
    Contrarecibo contrarecibo;

    static constraints = {
        descuentoFinanciero scale: 4
        contrarecibo nullable: true
    }

}
