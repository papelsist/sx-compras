package sx.cfdi

import grails.compiler.GrailsCompileStatic
import grails.gorm.DetachedCriteria
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

import sx.reports.ReportService
import sx.utils.Periodo

@Secured(['ROLE_CXC', 'ROLE_GASTOS', 'ROLE_TESORERIA'])
@GrailsCompileStatic
@Slf4j
class CfdiController extends RestfulController<Cfdi> {

    static responseFormats = ['json']

    ReportService reportService

    CfdiLocationService cfdiLocationService

    CfdiPrintService cfdiPrintService

    CfdiController() {
        super(Cfdi)
    }

    @Override
    protected List listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros?: 10

        log.info('List: {}', params)

        def receptor = params.emisor?: '%'
        def criteria = new DetachedCriteria(Cfdi).build {
            ilike('emisor', receptor)
        }
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            criteria = criteria.build {
                between('fecha', periodo.fechaInicial, periodo.fechaFinal)
            }
        }
        return criteria.list(params)
    }


    def search(SearchCfdi command) {
        def criteria = new DetachedCriteria(Cfdi).build {
            between('fecha', command.fechaIni, command.fechaFin)
            ilike('receptor', command.receptor)
        }
        respond criteria.list(params)
    }

    def print( Cfdi cfdi) {
        log.info('Imprimiendo CFDI: {}', params)
        def pdf = cfdiPrintService.getPdf(cfdi)
        render (file: pdf, contentType: 'application/pdf', filename: cfdi.fileName)
    }

    def mostrarXml(Cfdi cfdi){
        if(cfdi == null ){
            notFound()
            return
        }
        // log.info('Mostrando XML de CFDI:{} ', cfdi.id)
        render (file: cfdi.getUrl().newInputStream(), contentType: 'text/xml', filename: cfdi.fileName, encoding: "UTF-8")
    }

    def descargarXml(Cfdi cfdi) {
        def xml = cfdiLocationService.getXml(cfdi)
        File file = File.createTempFile('temp_', 'xml')
        file.setBytes(xml)

        response.setHeader("Content-disposition", "attachment; filename=\"$cfdi.fileName\"")
        response.setContentType("text/xml")
        // response.setContentType("application/octet-stream")
        InputStream contentStream = file.newInputStream()
        webRequest.renderView = false
        response.outputStream << contentStream
    }


}

class SearchCfdi {
    Date fechaIni
    Date fechaFin
    String receptor

    static constraints = {
        receptor nullable: true
    }
}

