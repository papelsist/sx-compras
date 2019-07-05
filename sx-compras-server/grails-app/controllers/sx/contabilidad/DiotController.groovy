package sx.contabilidad


import grails.rest.*

import sx.reports.ReportService

class DiotController extends RestfulController<Diot>{
    static responseFormats = ['json']

    ReportService reportService

    DiotController() {
        super(Diot)
    }

    @Override
    protected List<Diot> listAllResources(Map params) {
        Integer ej = params.ejercicio
        Integer ms = params.mes
        List<Diot> res = Diot.where{ejercicio == ej && mes == ms}.list()
        return res
    }
}
