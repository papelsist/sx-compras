package sx.compras


import grails.rest.*
import grails.converters.*

class RequisicionDeMaterialController extends RestfulController {
    static responseFormats = ['json', 'xml']
    RequisicionDeMaterialController() {
        super(RequisicionDeMaterial)
    }
}
