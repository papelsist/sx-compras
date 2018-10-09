package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.utils.Periodo

@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class ChequeController extends RestfulController<Cheque> {

    static responseFormats = ['json']

    ReportService  reportService

    ChequeController() {
        super(Cheque)
    }

    @Override
    protected List<Cheque> listAllResources(Map params) {

        log.info('List: {}', params)
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros ?: 20

        def query = Cheque.where {}

        def impresos = this.params.getBoolean('impresos', false)

        if(impresos) {
            query = query.where {impresion != null}
        }


        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }

        if(params.nombre) {
            query = query.where {nombre =~ params.nombre}
        }
        return query.list(params)
    }



    // @CompileDynamic
    def print( ) {
        Cheque cheque = Cheque.get(params.id.toString())
        cheque.impresion = new Date()
        cheque.save flush: true
        Map repParams = [ID: params.id]
        def pdf =  reportService.run('Requisicion.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Requisicion.pdf')
    }

    def printPoliza( ) {
        Map repParams = [ID: params.id]
        def pdf =  reportService.run('Requisicion.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Requisicion.pdf')
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
