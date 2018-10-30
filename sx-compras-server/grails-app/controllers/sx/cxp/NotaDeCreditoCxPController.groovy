package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.reports.ReportService
import sx.utils.Periodo

import java.sql.SQLException


@Slf4j()
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class NotaDeCreditoCxPController extends RestfulController<NotaDeCreditoCxP>{

    static responseFormats = ['json']

    NotaDeCreditoCxPService notaDeCreditoCxPService

    AplicacionDePagoService aplicacionDePagoService

    ReportService reportService

    NotaDeCreditoCxPController() {
        super(NotaDeCreditoCxP)
    }

    @Override
    protected List<NotaDeCreditoCxP> listAllResources(Map params) {
        params.max = 200
        // log.debug('List {}', params)
        params.sort = 'lastUpdated'
        params.order = 'desc'
        def query = NotaDeCreditoCxP.where {}
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return query.list(params)
    }


    @Override
    protected NotaDeCreditoCxP updateResource(NotaDeCreditoCxP resource) {
        return notaDeCreditoCxPService.actualizarNota(resource)
    }

    def aplicar(NotaDeCreditoCxP nota) {
        if(nota == null) {
            notFound()
            return
        }
        nota = notaDeCreditoCxPService.aplicar(nota)
        forward( action: 'show', id: nota.id)
        return
    }

    def deleteAplicacion(AplicacionDePago aplicacionDePago) {
        NotaDeCreditoCxP nota = aplicacionDePago.nota
        respond nota

    }

    def handleSQLException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }

    def print( ) {
        Map repParams = [ID: params.id, MONEDA: params.moneda]
        def pdf =  reportService.run('AplicacionDeNotaCxP.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'AplicacionDeNotaCxP.pdf')
    }


}
