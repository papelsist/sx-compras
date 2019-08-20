package sx.compras


import grails.rest.*
import grails.converters.*

class ListaDePreciosVentaDetController extends RestfulController {
    static responseFormats = ['json', 'xml']
    ListaDePreciosVentaDetController() {
        super(ListaDePreciosVentaDet)
    }
}
