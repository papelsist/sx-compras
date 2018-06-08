package sx.cxp


import grails.rest.*
import grails.converters.*

class CuentaPorPagarController extends RestfulController {
    static responseFormats = ['json', 'xml']
    CuentaPorPagarController() {
        super(CuentaPorPagar)
    }
}
