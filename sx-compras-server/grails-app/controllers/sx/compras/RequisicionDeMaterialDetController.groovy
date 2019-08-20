package sx.compras


import grails.rest.*
import grails.converters.*

class RequisicionDeMaterialDetController extends RestfulController {
    static responseFormats = ['json', 'xml']
    RequisicionDeMaterialDetController() {
        super(RequisicionDeMaterialDet)
    }
}
