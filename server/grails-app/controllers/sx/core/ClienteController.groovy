package sx.core


import grails.rest.*
import grails.converters.*

class ClienteController extends RestfulController {
    static responseFormats = ['json', 'xml']
    ClienteController() {
        super(Cliente)
    }
}
