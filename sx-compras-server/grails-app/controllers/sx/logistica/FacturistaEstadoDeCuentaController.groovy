package sx.logistica

import grails.rest.RestfulController
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService


@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class FacturistaEstadoDeCuentaController extends RestfulController<FacturistaEstadoDeCuenta>{

    static responseFormats = ['json']


    ReportService reportService

    FacturistaEstadoDeCuentaService facturistaEstadoDeCuentaService

    FacturistaEstadoDeCuentaController() {
        super(FacturistaEstadoDeCuenta)
    }

    @Override
    def index(Integer max) {
        log.info('List: {}', params)
        String id = params.facturistaId as String
        FacturistaDeEmbarque f = FacturistaDeEmbarque.get(id)
        if(f == null) {
            notFound()
            return
        }
        log.info('Faturista: {}', f)
        def rows = FacturistaEstadoDeCuenta.where{facturista == f}.list(params)
        respond rows
    }



    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }
}
