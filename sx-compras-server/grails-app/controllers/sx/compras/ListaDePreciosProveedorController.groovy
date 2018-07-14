package sx.compras


import grails.rest.*
import grails.converters.*

class ListaDePreciosProveedorController extends RestfulController {
    static responseFormats = ['json', 'xml']
    ListaDePreciosProveedorController() {
        super(ListaDePreciosProveedor)
    }
}
