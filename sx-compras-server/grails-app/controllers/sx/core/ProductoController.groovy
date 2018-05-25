package sx.core


import grails.rest.*
import grails.converters.*

class ProductoController extends RestfulController {
    static responseFormats = ['json']
    ProductoController() {
        super(Producto)
    }
}
