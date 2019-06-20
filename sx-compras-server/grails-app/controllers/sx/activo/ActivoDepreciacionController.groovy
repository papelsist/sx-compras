package sx.activo


import grails.rest.*
import grails.converters.*

class ActivoDepreciacionController extends RestfulController {
    static responseFormats = ['json', 'xml']
    ActivoDepreciacionController() {
        super(ActivoDepreciacion)
    }
}
