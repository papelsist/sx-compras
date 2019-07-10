package sx.contabilidad


import grails.rest.*
import groovy.util.logging.Slf4j
import grails.plugin.springsecurity.annotation.Secured
import sx.utils.Periodo

import sx.reports.ReportService

@Slf4j
@Secured("ROLE_CONTABILIDAD")
class DiotController extends RestfulController<Diot>{
    static responseFormats = ['json']

    ReportService reportService
    DiotService diotService

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

    def generarDiot() {
            Periodo periodo = params.periodo
            def rows = diotService.generarDiot(periodo)
    }

    def layoutDiot(){
        //def rows = Diot.findAllBy
    }

   


}
