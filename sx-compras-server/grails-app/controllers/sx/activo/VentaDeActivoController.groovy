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
class VentaDeActivoController extends RestfulController<VentaDeActivo> {
    static responseFormats = ['json']
    
    VentaDeActivoController() {
        super(VentaDeActivo)
    }

    @Override
    protected List<VentaDeActivo> listAllResources(Map params) {
    	params.max = 2000
        log.info('List {}', params)
        def query = VentaDeActivo.where{}
        return  query.list(params)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
