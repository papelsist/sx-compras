package sx.cxp

import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j


@CompileStatic
@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class AnalisisDeFacturaDetController extends RestfulController<AnalisisDeFacturaDet> {
    static responseFormats = ['json']
    AnalisisDeFacturaDetController() {
        super(AnalisisDeFacturaDet)
    }

    @Override
    Object save() {
        log.debug('Salvando AnalisisDet: {}', params)
        return super.save()
    }

    @Override
    @CompileDynamic
    protected List<AnalisisDeFacturaDet> listAllResources(Map params) {
        String anslisis = params.analisisDeFacturaId
        return AnalisisDeFacturaDet.where{ anslisis.id == analisis}.list()
    }
}
