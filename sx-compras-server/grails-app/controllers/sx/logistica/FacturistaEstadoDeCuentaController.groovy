package sx.logistica

import grails.rest.RestfulController
import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils
import sx.cxc.NotaDeCargo
import sx.reports.ReportService
import sx.utils.Periodo


@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class FacturistaEstadoDeCuentaController extends RestfulController<FacturistaEstadoDeCuenta>{

    static responseFormats = ['json']


    ReportService reportService

    FacturistaEstadoDeCuentaService facturistaEstadoDeCuentaService

    FacturistaEstadoDeCuentaController() {
        super(FacturistaEstadoDeCuenta)
    }

    @Override
    def index(Integer max) {
        log.info('List: {}', params)
        String id = params.facturistaId as String
        FacturistaDeEmbarque f = FacturistaDeEmbarque.get(id)
        if(f == null) {
            notFound()
            return
        }
        log.info('Faturista: {}', f)
        List<FacturistaEstadoDeCuenta> rows = FacturistaEstadoDeCuenta.where{facturista == f}.list([sort: 'fecha', 'order': 'asc'])
        BigDecimal saldo = 0.0
        rows.each {
            saldo += it.importe
            it.saldo = saldo
        }
        respond rows
    }

    def calcularIntereses(CalcularInteresCommand command) {
        if(command == null) {
            log.info('Se requiere el periodo para generar el calculo de intereses')
            notFound()
            return
        }
        log.info('Intereses al corte: {}, tasa: {}, facturista: {} ', command.corte, command.tasa, command.facturista)
        if(command.facturista) {
            List<FacturistaEstadoDeCuenta> res = facturistaEstadoDeCuentaService
                    .calcularInteresesPorFacturista(command.corte, command.tasa, command.facturista)
            respond res
            return

        } else {
            facturistaEstadoDeCuentaService.calcularInteresesGlobales(command.corte, command.tasa)
            respond ([message: 'INTERESES GENERADOS', status: 200])

        }
    }

    def generarNotaDeCargo(FacturistaDeEmbarque facturista) {
        if(facturista == null) {
            notFound()
            return
        }
        String comentario = params.comentario?: 'INTERESES PRESTAMO '
        log.info('Generando nota de cargo por intereses de prestamo para {}', facturista)
        facturistaEstadoDeCuentaService.generarNotaDeCargo(facturista, new Date(), comentario)
        respond ([message: 'NOTA DE CARGO  GENERADA ', status: 200])
    }

    def estadoDeCuenta() {
        Periodo periodo = (Periodo)params.periodo
        Map repParams = [
                FECHA_INI: periodo.fechaInicial,
                FECHA_FIN: periodo.fechaFinal,
                FACTURISTA: params.facturista
        ]
        def pdf =  reportService.run('embarques/EstadoDeCuentaFacturista.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EstadoDeCuentaFacturista.jrxml.pdf')
    }



    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }
}

class CalcularInteresCommand {
    Date corte
    BigDecimal tasa
    FacturistaDeEmbarque facturista


    static constraints = {
        facturista nullable: true
    }

}
