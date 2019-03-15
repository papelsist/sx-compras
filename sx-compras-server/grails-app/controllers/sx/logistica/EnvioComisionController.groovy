package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class EnvioComisionController extends RestfulController<EnvioComision> {

    static responseFormats = ['json']

    ReportService reportService

    EnvioComisionController() {
        super(EnvioComision)
    }
}
