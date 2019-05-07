package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.util.logging.Slf4j


@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class PolizaDetController extends RestfulController<PolizaDet> {

    static responseFormats = ['json']

    PolizaDetController(){
        super(PolizaDet)
    }

    /*
    def index(Integer max) {
        params.max = Math.min(max ?: 10, 100)
        respond listAllResources(params), model: [("${resourceName}Count".toString()): countResources()]
    }
    */

    @Override
    protected List<PolizaDet> listAllResources(Map params) {
        List<PolizaDet> partidas  = PolizaDet.where{poliza.id == params.polizaId}.list()
        log.info('Poliza {} partidas: {}', params.polizaId, partidas.size())
        return partidas
    }

}
