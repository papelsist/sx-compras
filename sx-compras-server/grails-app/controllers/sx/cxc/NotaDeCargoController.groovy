package sx.cxc

import groovy.transform.CompileDynamic

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

import sx.reports.ReportService
import sx.utils.Periodo
import sx.logistica.FacturistaEstadoDeCuentaService
import sx.logistica.FacturistaDeEmbarque

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_TESORERIA', 'ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
class NotaDeCargoController extends RestfulController<NotaDeCargo> {

    static responseFormats = ['json']

    NotaDeCargoService notaDeCargoService

    FacturistaEstadoDeCuentaService facturistaEstadoDeCuentaService

    ReportService reportService

    NotaDeCargoController() {
        super(NotaDeCargo)
    }

    @Override
    protected List<NotaDeCargo> listAllResources(Map params) {
        log.info('List params: {}', params)
        params.sort = params.sort ?: 'id'
        params.order = params.order ?: 'desc'
        params.max = params.registros ?: 1000

        def cartera = params.cartera

        log.info('List: {} tipo: {}', params, cartera)

        def query = NotaDeCargo.where { }

        if(cartera) {
            log.info('Cartera: {}', cartera)
            query = query.where{ tipo == cartera}
        }

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return query.list(params)

    }

    def generarCfdi(NotaDeCargo notaDeCargo) {
        if(notaDeCargo == null){
            notFound()
            return
        }
        notaDeCargo = notaDeCargoService.generarCfdi(notaDeCargo)
        respond notaDeCargo
    }

    def timbrar(NotaDeCargo notaDeCargo) {
        if(notaDeCargo == null){
            notFound()
            return
        }
        notaDeCargoService.timbrar(notaDeCargo)
        notaDeCargo.refresh()
        respond notaDeCargo

    }

    // @CompileDynamic()
    def generarNotasDeCargoPorIntereses(NotasPorIntereses command) {
        
        if(command == null) {
            notFound()
            return
        }
        log.info('Generando notas {}', command)
        def res = []
        if(command.facturista) {
      
            def nota = facturistaEstadoDeCuentaService.generarNotaDeCargo(command.facturista, command.fechaFinal, command.descripcion)
            println nota
            res << nota
            respond res
        } else {
            res = facturistaEstadoDeCuentaService.generarNotasDeCargoPorIntereses(command.fechaFinal, command.descripcion)
            respond res
        }
        
    }

    /*
    def print(NotaDeCargo nota) {
        assert nota.cfdi, 'Nota sin timbrar: ' + nota.id
        def realPath = servletContext.getRealPath("/reports") ?: 'reports'
        def data = NotaDeCargoPdfGenerator.getReportData(nota)
        Map parametros = data['PARAMETROS']
        parametros.LOGO = realPath + '/PAPEL_CFDI_LOGO.jpg'
        def pdf  = reportService.run('PapelCFDI3Nota.jrxml', data['PARAMETROS'], data['CONCEPTOS'])
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'NotaDeCredito.pdf')
    }
    */
}

class NotasPorIntereses  {
    Date fechaInicial
    Date fechaFinal
    String descripcion
    FacturistaDeEmbarque facturista

    static constraints = {
        facturista nullable: true
    }

    String toString() {
        return "${descripcion} ${facturista?: 'TODOS LOS FACTURISTAS'}"
    }
}
