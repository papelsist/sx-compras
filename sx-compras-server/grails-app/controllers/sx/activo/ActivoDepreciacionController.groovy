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
class ActivoDepreciacionController extends RestfulController<ActivoDepreciacion> {

	ActivoDepreciacionService activoDepreciacionService

    static responseFormats = ['json']
    
    ActivoDepreciacionController() {
        super(ActivoDepreciacion)
    }

    @Override
    protected List<ActivoDepreciacion> listAllResources(Map params) {
        log.info('List {}', params)
        def query = ActivoDepreciacion.where{}
        return  query.list()
    }

    @Override
    protected ActivoDepreciacion saveResource(ActivoDepreciacion resource) {
        return activoDepreciacionService.save(resource)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
