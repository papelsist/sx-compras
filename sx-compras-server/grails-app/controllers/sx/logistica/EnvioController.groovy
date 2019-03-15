package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class EnvioController extends RestfulController<Envio> {

    static responseFormats = ['json']

    ReportService reportService

    EnvioController() {
        super(Envio)
    }
}
