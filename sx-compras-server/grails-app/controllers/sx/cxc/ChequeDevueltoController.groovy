package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class ChequeDevueltoController extends RestfulController<ChequeDevuelto> {

    static responseFormats = ['json']

    ReportService reportService

    ChequeDevueltoService chequeDevueltoService

    ChequeDevueltoController() {
        super(ChequeDevuelto)
    }

    @Override
    protected ChequeDevuelto createResource() {
        ChequeDevuelto che = new ChequeDevuelto()
        return che
    }

    @Override
    protected ChequeDevuelto saveResource(ChequeDevuelto resource) {
        return chequeDevueltoService.save(resource)
    }


    @Override
    protected ChequeDevuelto updateResource(ChequeDevuelto resource) {
        throw new RuntimeException('No se permite modificar cheques devueltos')
    }

    /*
    def registrarChequeDevuelto(ChequeDevueltoCommand command){
        if(command == null){
            notFound()
            return
        }
        Cobro cobro = command.cobro
        this.chequeDevueltoService.registrarChequeDevuelto(cobro.cheque, command.fecha)
        cobro.comentario = "CHEQUE DEVUELTO EL: ${command.fecha.format('dd/MM/yyyy')}"
        cobro = cobro.save flush: true
        respond cobro
    }
    */

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}


