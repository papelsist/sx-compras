package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.core.GrailsApplication
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.transaction.NotTransactional
import grails.web.databinding.WebDataBinding
import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService
import sx.utils.Periodo

import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import org.hibernate.FetchMode as FM

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class PolizaController extends RestfulController<Poliza> {

    static responseFormats = ['json']

    PolizaService polizaService

    ReportService reportService

    GrailsApplication grailsApplication

    PolizaDeEgresoService polizaDeEgresoService

    SaldoPorCuentaContableService saldoPorCuentaContableService

    PolizaController() {
        super(Poliza)
    }

    @Secured("permitAll")
    @CompileDynamic
    def show() {
        // log.info("Show: {}", params)
        respond Poliza.findById(params.getLong('id'), [fetch:[partidas:"join"]])
    }

    @Override
    protected List<Poliza> listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        params.ejercicio = params.ejercicio?: Periodo.currentYear()
        params.mes = params.mes?: Periodo.currentMes()
        log.debug('List : {}', params)

        def criteria = new DetachedCriteria(Poliza).build {
            eq('ejercicio', this.params.getInt('ejercicio'))
            eq('mes', this.params.getInt('mes'))
            eq('tipo', params.tipo)
            eq('subtipo', params.subtipo)
        }
        return criteria.list(params)
    }


    def save(PolizaCreateCommand command) {
        if(command == null) {
            notFound()
            return
        }
        Poliza poliza = new Poliza()
        poliza.properties = command

        String pname = polizaService.resolverProcesador(poliza)
        log.info("Generando poliza(s) con procesador: {}", pname)
        ProcesadorDePoliza procesador = (ProcesadorDePoliza)grailsApplication.mainContext.getBean(pname)
        poliza.concepto = procesador.definirConcepto(poliza)

        poliza = polizaService.salvarPolza(poliza)
        respond poliza

    }

    @CompileDynamic
    def generarPolizas(){
        PolizaCreateCommand command = new PolizaCreateCommand()
        command.properties = getObjectToBind()
        String pname = polizaService.resolverProcesador(command.subtipo)
        ProcesadorMultipleDePolizas procesador = (ProcesadorMultipleDePolizas)grailsApplication.mainContext.getBean(pname)
        List<Poliza> res = procesador.generarPolizas(command)
        List<Poliza> polizas = []
        res.each {
            polizas << polizaService.salvarPolza(it)

        }
        respond polizas
    }

    @CompileDynamic
    def generarPolizasEgreso(){
        PolizaCreateCommand command = new PolizaCreateCommand()
        command.properties = getObjectToBind()
        log.info('Generando polizas de egreso para {}', command)
        List<Poliza> polizas = polizaDeEgresoService
                .generarPolizas(command.subtipo, command.ejercicio, command.mes, command.fecha)
        respond polizas
    }


    @Override
    @NotTransactional
    @CompileDynamic
    def update() {
        Poliza poliza = Poliza.get(params.id)
        if (poliza == null) {
            notFound()
            return
        }
        poliza.properties = getObjectToBind()
        poliza = polizaService.updatePoliza(poliza)
        respond poliza, [status: OK, view:'show']

    }

    @CompileDynamic
    def cerrar() {
        Poliza poliza = Poliza.get(params.id)
        if (poliza == null) {
            notFound()
            return
        }
        poliza.cierre = new Date()
        poliza = poliza.save flush: true
        saldoPorCuentaContableService.actualizarSaldos(poliza)
        respond poliza, [status: OK, view:'show']

    }


    def recalcular(Poliza poliza) {
        if(poliza == null){
            notFound()
            return
        }
        if(poliza.manual) {
            throw new RuntimeException("Poliza ${poliza.id} es MANUAL no se puede recaluclar de manera automatica")
        }
        ProcesadorDePoliza procesador = getProcesador(poliza)
        poliza = procesador.recalcular(poliza)
        poliza = polizaService.updatePoliza(poliza)
        respond poliza, [ view:'show']
    }

    @CompileDynamic
    def generarFolios(String subtipo, Integer ejercicio, Integer mes) {
        List<Poliza> polizas = polizaService.refoliar(subtipo, ejercicio, mes)
        respond polizas, [ view: 'index']

    }

    def generarComplementos(Poliza poliza) {
        if(poliza == null) {
            notFound()
            return
        }

        poliza = getProcesador(poliza).generarComplementos(poliza)
        poliza = polizaService.salvarPolza(poliza)
        log.info('Complementos generados {}', new Date())
        respond poliza, [view: 'show']
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        // e.printStackTrace()
        log.error(message, e)
        respond([message: message], status: 500)
    }

    def print( ) {
        Map repParams = [ID: params.getLong('id')]
        // repParams.ORDEN = ''
        def pdf =  reportService.run('contabilidad/Poliza.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Poliza.pdf')
    }

    def printComprobantes() {
        def tipo = params.tipo
        def name = 'PolizaComprobanteNacional.jrxml'
        if(tipo == 'E')
            name = 'PolizaComprobanteExtranjero.jrxml'
        else if (tipo == 'P')
            name = 'PolizaComplementoMetodoPago.jrxml'
        Map repParams = [ POLIZA_ID: params.getLong('id')]
        def pdf =  reportService.run("contabilidad/${name}", repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'PolizaComprobanteNacional.pdf')
    }

    ProcesadorDePoliza getProcesador(Poliza poliza) {
        String pname = polizaService.resolverProcesador(poliza)
        ProcesadorDePoliza procesador = (ProcesadorDePoliza)grailsApplication.mainContext.getBean(pname)
        return procesador
    }


}

@ToString
class PolizaCreateCommand implements  WebDataBinding {

    Integer ejercicio
    Integer mes
    String tipo
    String subtipo
    Integer folio
    Date fecha

    static constraints = {
        importFrom Poliza
    }

}