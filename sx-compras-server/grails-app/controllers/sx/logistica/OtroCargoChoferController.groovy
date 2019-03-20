package sx.logistica


import grails.rest.*
import grails.converters.*

class OtroCargoChoferController extends RestfulController {
    static responseFormats = ['json', 'xml']
    OtroCargoChoferController() {
        super(OtroCargoChofer)
    }
}
