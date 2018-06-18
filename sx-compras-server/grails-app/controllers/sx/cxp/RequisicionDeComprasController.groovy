package sx.cxp


import grails.rest.*
import grails.converters.*

class RequisicionDeComprasController extends RestfulController {
    static responseFormats = ['json', 'xml']
    RequisicionDeComprasController() {
        super(RequisicionDeCompras)
    }
}
