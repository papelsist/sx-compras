package sx.core


import grails.rest.*
import grails.converters.*

class ClaseController extends RestfulController {
    static responseFormats = ['json']
    ClaseController() {
        super(Clase)
    }
}
