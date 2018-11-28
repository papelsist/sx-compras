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
    @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
    def index(Integer max) {
        params.max = max?: 5000
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        log.debug('List : {}', params)
        def rows = CuentaContable.createCriteria().list {
            order('clave', 'asc')
        }
        respond rows, model: [("${resourceName}Count".toString()): countResources()]
        //respond CuentaContable.list(params), model: [("${resourceName}Count".toString()): countResources()]
    }


    @Override
    protected CuentaContable saveResource(CuentaContable resource) {
        return cuentaContableService.salvarCuenta(resource)
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
