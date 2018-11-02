package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.http.HttpStatus
import sx.core.Sucursal
import sx.cxc.CobroCheque
import sx.reports.ReportService

import static org.springframework.http.HttpStatus.CREATED

@Slf4j
// @GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class FichaController extends RestfulController<Ficha> {

    static responseFormats = ['json']

    ReportService reportService

    FichaService fichaService

    FichaController() {
        super(Ficha)
    }

    @Override
    protected List listAllResources(Map params) {

        params.max = 1000
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        String cartera = params.cartera ?: 'CREDITO'

        log.debug('List : {}', params)

        FichasPorFechaCommand command = new FichasPorFechaCommand()
        bindData(command, params)
        def query = Ficha.where {fecha == command.fecha}
        if(command.tipo ){
            query = query.where{ origen == command.tipo}
        }
        log.info('Sucursal: ', command.sucursal)
        if(command.sucursal) {
            query = query.where{ sucursal == command.sucursal}
        }
        return query.list(params)
    }

    @Override
    protected void deleteResource(Ficha resource) {
        fichaService.cancelarFicha(resource)
    }

    @Transactional
    def generar(FichasBuildCommand command) {
        log.debug('Generando fichas: {}', this.params)
        if(command == null) {
            notFound()
            return
        }
        command.validate()
        if(command.hasErrors()) {
            transactionStatus.setRollbackOnly()
            respond command.errors, view:'create' // STATUS CODE 422
            return
        }
        List<Ficha> fichasList = fichaService.generar(command.formaDePago, command.fecha, command.tipo, command.cuenta)
        respond fichasList, [status: CREATED, view:'index']
    }

    def cheques() {
        // log.debug('Buscando cheques de ficha: {}', params)
        def fichaId = params.fichaId
        def list = CobroCheque.where {ficha.id == fichaId}.list()
        respond list
    }

    def ingreso() {
        Ficha ficha = Ficha.get(params.fichaId)
        log.debug('Registrando ingreso {}', ficha)
        ficha = fichaService.registrarIngreso(ficha)
        respond ficha
    }

    def reporteDeRelacionDeFichas(RelacionDeFichasCommand command){
        log.debug('Rep: params {}', params)
        log.debug('Rep command: {}', command)
        def repParams = [FECHA: command.fecha]
        repParams.ORIGEN = command.origen
        repParams.SUCURSAL = command.sucursal.id
        def pdf =  reportService.run('RelacionDeFichas.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'RelacionDeFichas.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }

}

class FichasPorFechaCommand {

    Date fecha

    String tipo

    Sucursal sucursal

    String toString() {
        return fecha.format('dd/MM/yyyy')
    }

    static constraints = {
        tipo nullable: true
        sucursal nullable: true
    }
}

class FichasBuildCommand implements  Validateable{
    Date fecha
    String formaDePago
    String tipo
    CuentaDeBanco cuenta

    String toString() {
        return "${formaDePago} ${tipo} ${fecha?.format('dd/MM/yyyy')} ${cuenta?.descripcion}"
    }
}

class RelacionDeFichasCommand {
    Date fecha
    String origen
    Sucursal sucursal

}
