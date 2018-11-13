package sx.tesoreria


import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class ComisionBancariaController extends RestfulController<ComisionBancaria> {

    static responseFormats = ['json']

    ComisionBancariaService comisionBancariaService

    ReportService reportService

    ComisionBancariaController() {
        super(ComisionBancaria)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        log.debug('List : {}', params)
        Periodo periodo = (Periodo)params.periodo

        def criteria = new DetachedCriteria(ComisionBancaria).build {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
        }
        return criteria.list(params)
    }


    @Override
    protected ComisionBancaria saveResource(ComisionBancaria resource) {
        return comisionBancariaService.registrar(resource)
    }


    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
