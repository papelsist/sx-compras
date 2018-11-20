package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class CuentaContableController extends RestfulController <CuentaContable>{

    static responseFormats = ['json']

    CuentaContableService cuentaContableService

    ReportService reportService

    CuentaContableController() {
        super(CuentaContable)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 2000
        log.debug('List : {}', params)
        return CuentaContable.list(params)
    }


    @Override
    protected CuentaContable saveResource(CuentaContable resource) {
        return cuentaContableService.save(resource)
    }

    @Override
    @CompileDynamic
    protected void deleteResource(CuentaContable resource) {
        cuentaContableService.delete(resource.id)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
