package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import static org.springframework.http.HttpStatus.*

import org.apache.commons.lang3.exception.ExceptionUtils


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j



// @GrailsCompileStatic
@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class SatMetadataController extends RestfulController<SatMetadata> {
    
    static responseFormats = ['json']

    SatMetadataService satMetadataService

    SatMetadataController() {
        super(SatMetadata)
    }

    @Override
    protected List<SatMetadata> listAllResources(Map params) {
        log.info('List: {}', params)
        def ej = params.ejercicio
        def ms = params.mes
        def query =  SatMetadata.where{ejercicio == ej && mes == ms}
        def res = query.list([sort: 'fechaEmision', order: 'asc'])
        respond res
    }

    def importar(Integer ejercicio, Integer mes) {
        satMetadataService.eliminarRegistros(ejercicio, mes)
        satMetadataService.importar(ejercicio, mes)
        render status: NO_CONTENT
        
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
