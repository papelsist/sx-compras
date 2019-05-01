package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.cfdi.Cfdi
import sx.reports.ReportService
import sx.utils.Periodo

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

    @Override
    protected List<NotaDeCargo> listAllResources(Map params) {
        log.info('List params: {}', params)
        params.sort = params.sort ?: 'lastUpdated'
        params.order = params.order ?: 'desc'
        params.max = params.registros ?: 20

        def cartera = params.cartera

        log.info('List: {} tipo: {}', params, cartera)

        def query = NotaDeCargo.where { }

        if(cartera) {
            log.info('Cartera: {}', cartera)
            query = query.where{ tipo == cartera}
        }

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
           //  query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
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
