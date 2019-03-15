package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class EnvioDetController extends RestfulController<EnvioDet> {

    static responseFormats = ['json']

    EnvioDetController() {
        super(EnvioDet)
    }
}
