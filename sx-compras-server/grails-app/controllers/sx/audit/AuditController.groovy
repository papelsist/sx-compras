package sx.audit


import grails.rest.*
import grails.converters.*

class AuditController extends RestfulController {
    static responseFormats = ['json', 'xml']
    AuditController() {
        super(Audit)
    }
}
