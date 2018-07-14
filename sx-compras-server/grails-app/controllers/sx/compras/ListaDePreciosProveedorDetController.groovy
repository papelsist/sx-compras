package sx.compras


import grails.rest.*
import grails.converters.*

class ListaDePreciosProveedorDetController extends RestfulController {
    static responseFormats = ['json', 'xml']
    ListaDePreciosProveedorDetController() {
        super(ListaDePreciosProveedorDet)
    }
}
