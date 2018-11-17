package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService

import static org.springframework.http.HttpStatus.CREATED

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
    Object save() {
        def instance = createResource()
        instance = chequeDevueltoService.save(instance)
        respond instance, [status: CREATED, view:'show']
    }

    @Override
    protected ChequeDevuelto createResource() {
        ChequeDevuelto instance = new ChequeDevuelto()
        instance.folio = 0L
        bindData instance, getObjectToBind()
        instance.nombre = instance.cheque.cobro.cliente.nombre
        return instance
    }

    @Override
    protected void deleteResource(ChequeDevuelto resource) {
        chequeDevueltoService.cancelar(resource)
    }

    @Override
    protected ChequeDevuelto updateResource(ChequeDevuelto resource) {
        throw new RuntimeException('No se permite modificar cheques devueltos')
    }

    @Override
    protected List<ChequeDevuelto> listAllResources(Map params) {
        params.max = 1000
        return super.listAllResources(params)
    }

    def cobros() {
        params.max = params.max?: 20
        params.sort = 'lastUpdated'
        params.order = 'desc'
        log.info('Buscando cobros con cheque: {}', params)

        def query = CobroCheque.where {}
        if(params.folio) {
            query = query.where{ numero == params.getLong('folio')}
        }
        if(params.importe) {
            BigDecimal importe = params.importe as BigDecimal
            query = query.where{ cobro.importe == importe}
        }
        List<CobroCheque> cobros = query.list(params)
        [cobros: cobros]

    }

    def reporteDeChequesDevueltos() {
        def repParams = [FECHA_INI: params.getDate('fecha', 'dd/MM/yyyy')]
        def pdf =  reportService.run('ChequesDevueltos.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ChequesDevueltos.pdf')
    }


    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        e.printStackTrace()
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}


