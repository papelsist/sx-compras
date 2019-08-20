package sx.cxp

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@Secured(['ROLE_COMPRAS','ROLE_GASTOS'])
@GrailsCompileStatic
class ReciboElectronicoController extends RestfulController<ReciboElectronico> {
    
    static responseFormats = ['json']

    ReportService reportService

    ReciboElectronicoService reciboElectronicoService

    ReciboElectronicoController() {
        super(ReciboElectronico)
    }

    @Override
    @CompileDynamic
    protected List<ReciboElectronico> listAllResources(Map params) {
        params.sort = 'fecha'
        params.order = 'desc'
        params.max = 5000
        log.info('List {}', params)
        Periodo periodo = params.periodo
        def query = ReciboElectronico.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return  query.list(params)
    }

    @Override
    protected ReciboElectronico saveResource(ReciboElectronico resource) {
        return reciboElectronicoService.save(resource)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
