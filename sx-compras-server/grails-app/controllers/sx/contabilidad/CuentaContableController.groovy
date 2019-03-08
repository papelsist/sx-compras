package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService

import static org.springframework.http.HttpStatus.OK

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
        // params.max = max?: 5000
        params.max = max?: 30
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'

        def q = CuentaContable.where {}

        if(params.getBoolean('mayor')) {
            q = q.where {padre == null}
        }
        if(params.getBoolean('detalle')){
            q = q.where {detalle == true}
        }

        if(params.term) {
            def term = "${params.term}%"
            q = q.where {clave =~ term || descripcion =~ term.toUpperCase()}
        }
        respond q.list(params)
    }

    @CompileDynamic
    def update() {
        if(handleReadOnly()) {
            return
        }

        CuentaContable instance = CuentaContable.get(params.id)
        if (instance == null) {
            transactionStatus.setRollbackOnly()
            notFound()
            return
        }

        instance.properties = getObjectToBind()

        if (instance.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond instance.errors, view:'edit' // STATUS CODE 422
            return
        }

        updateResource instance
        respond instance, [status: OK, view: 'show']
    }


    @Override
    protected CuentaContable createResource() {
        CuentaContable instance = new CuentaContable()
        bindData instance, getObjectToBind()
        instance.nivel = instance.padre ? instance.padre.nivel + 1 : 1
        instance
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
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
