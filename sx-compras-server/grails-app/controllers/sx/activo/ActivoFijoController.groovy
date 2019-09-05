package sx.activo

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.reports.ReportService


@Slf4j
@Secured(['ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
@GrailsCompileStatic
class ActivoFijoController extends RestfulController<ActivoFijo> {
    
    static responseFormats = ['json']

    ActivoFijoService activoFijoService

    ActivoFijoController() {
        super(ActivoFijo)
    }

    @Override
    protected List<ActivoFijo> listAllResources(Map params) {
        log.info('List {}', params)
        def query = ActivoFijo.where{}
        return  query.list()
    }

    @Override
    protected ActivoFijo createResource() {
        ActivoFijo activo = new ActivoFijo()
        bindData activo, getObjectToBind()
        return activo
    }

    @Override
    protected ActivoFijo saveResource(ActivoFijo resource) {
        return activoFijoService.save(resource)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }


}
