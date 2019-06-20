package sx.activo


import grails.rest.*
import grails.converters.*

class ActivoFijoController extends RestfulController {
    static responseFormats = ['json', 'xml']
    ActivoFijoController() {
        super(ActivoFijo)
    }
}
