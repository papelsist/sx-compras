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
        Integer ej = params.ejercicio as Integer
        Integer ms = params.mes as Integer
        List<Diot> res = Diot.where{ejercicio == ej && mes == ms}.list()
        return res
    }

    def generar() {
        Integer ej = params.ejercicio as Integer
        Integer ms = params.mes as Integer
        Periodo periodo = Periodo.getPeriodoEnUnMes( ms  - 1, ej)
        log.info('Generar diot para {}', params)
        def rows = diotService.generarDiot(periodo)
        respond rows
    }

    def layout(){
        log.info('Generando layout {}', params)
        Integer ej = params.ejercicio as Integer
        Integer ms = params.mes as Integer
        Periodo periodo = Periodo.getPeriodoEnUnMes( ms  - 1, ej)
        def file = diotService.layout(ms, ej)
        response.setHeader("Content-disposition", "attachment; filename=\"DIOT_${ej}${ms}.txt\"")
        response.setContentType("text/plain")
        InputStream contentStream = file.newInputStream()
        webRequest.renderView = false
        response.outputStream << contentStream

    }


}
