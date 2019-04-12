package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_TESORERIA', 'ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
class NotaDeCargoController extends RestfulController<NotaDeCargo> {

    static responseFormats = ['json']

    NotaDeCargoService notaDeCargoService

    ReportService reportService

    NotaDeCargoController() {
        super(NotaDeCargo)
    }
}
