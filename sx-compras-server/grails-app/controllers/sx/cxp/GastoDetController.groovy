package sx.cxp


import grails.rest.*
import grails.converters.*

class GastoDetController extends RestfulController {
    static responseFormats = ['json', 'xml']
    GastoDetController() {
        super(GastoDet)
    }
}
