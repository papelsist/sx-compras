package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Sucursal
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class CobroController extends RestfulController<Cobro> {
    static responseFormats = ['json']

    ReportService reportService
    CobroService cobroService

    CobroController() {
        super(Cobro)
    }

    @Override
    protected List<Cobro> listAllResources(Map params) {
        params.sort = params.sort ?: 'lastUpdated'
        params.order = params.order ?: 'desc'
        params.max = params.registros ?: 20
        def stipo = params.tipo ?: 'CRE'

        log.info('List: {}', params)

        def query = Cobro.where { formaDePago != 'BONIFICACION' || formaDePago != 'DEVOLUCION'}

        if(stipo != 'TODOS') {
            query = Cobro.where{ tipo == stipo}
        } else {
            query = Cobro.where{ tipo != 'CON' && tipo != 'COD'}
        }

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }

        if(params.nombre) {
            query = query.where {cliente.nombre =~ params.nombre}
        }
        return query.list(params)
    }

    @Override
    protected Cobro createResource() {
        Cobro cobro =  new Cobro()
        bindData cobro, getObjectToBind()
        cobro.sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        return cobro
    }



    @Override
    protected Cobro saveResource(Cobro cobro) {
        return this.cobroService.save(cobro)
    }

    @Override
    protected Cobro updateResource(Cobro resource) {
        return this.cobroService.update(resource)
    }

    def registrarChequeDevuelto(ChequeDevueltoCommand command){
        if(command == null){
            notFound()
            return
        }
        // this.chequeDevueltoService.registrarChequeDevuelto(cobro.cheque, fecha)
        Cobro cobro = command.cobro
        cobro.comentario = "CHEQUE DEVUELTO EL: ${command.fecha.format('dd/MM/yyyy')}"
        cobro.save flush: true
        respond cobro
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

class ChequeDevueltoCommand implements  Validateable {
    Cobro cobro
    Date fecha
}
