package sx.cxp

class RequisicionDeGastos extends Requisicion{

    Boolean porComprobar

    static constraints = {
        porComprobar nullable: true
    }
}
