package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.util.Environment

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.cfdi.auditoria.MetaDataReader

// @GrailsCompileStatic
@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class SatMetadataController extends RestfulController<SatMetadata> {
    
    static responseFormats = ['json']

    MetaDataReader metaDataReader

    SatMetadataController() {
        super(SatMetadata)
    }

    @Override
    protected List<SatMetadata> listAllResources(Map params) {
        log.info('List: {}', params)
        def query =  SatMetadata.where{}

        def res = query.list(params)
        respond res
    }


    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
