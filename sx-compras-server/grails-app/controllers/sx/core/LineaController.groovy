package sx.core


import grails.rest.*
import grails.converters.*

class LineaController extends RestfulController {
    static responseFormats = ['json']
    LineaController() {
        super(Linea)
    }
}
