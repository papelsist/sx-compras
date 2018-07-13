package sx.core


import grails.rest.*
import grails.converters.*

class ProveedorProductoController extends RestfulController {
    static responseFormats = ['json']
    ProveedorProductoController() {
        super(ProveedorProducto)
    }
}
