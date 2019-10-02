package sx.cxp


import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class AnalisisDeTransformacionDetController extends RestfulController<AnalisisDeTransformacionDet>{
    
    static responseFormats = ['json']

    AnalisisDeTransformacionDetService analisisDeTransformacionDetService

    AnalisisDeTransformacionDetController() {
        super(AnalisisDeTransformacionDet)
    }

    @Override
    protected List<AnalisisDeTransformacionDet> listAllResources(Map params) {
        log.info('List {}', params)
        Long analisisId = params['analisisDeTransformacionId'] as Long
        def query = AnalisisDeTransformacionDet.where{analisis.id == analisisId}
        return  query.list()
    }
    
    @Override
    def save() {
        log.info('Save: {} ', params)
        Long analisisId = params['analisisDeTransformacionId'] as Long
        AnalisisDeTransformacion analisis = AnalisisDeTransformacion.get(analisisId)
        AnalisisDeTransformacionDet resource = new AnalisisDeTransformacionDet()
        
        bindData resource, getObjectToBind()
        resource.analisis = analisis
        resource = analisisDeTransformacionDetService.save(resource)
        respond resource
    }
   

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message)
        respond([message: message], status: 500)
    }
}
