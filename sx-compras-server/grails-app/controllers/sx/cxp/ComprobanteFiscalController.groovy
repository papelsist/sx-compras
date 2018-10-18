package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.converters.*
import org.springframework.web.multipart.MultipartFile
import sx.utils.Periodo

// @GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ComprobanteFiscalController extends RestfulController<ComprobanteFiscal> {
    static responseFormats = ['json', 'xml']

    ComprobanteFiscalService comprobanteFiscalService
    ComprobanteFiscalController() {
        super(ComprobanteFiscal)
    }

    @Override
    protected List<ComprobanteFiscal> listAllResources(Map params) {

        params.sort = 'fecha'
        params.order = 'desc'
        def tipo = params.tipo ?: 'COMPRAS'
        if(tipo == 'COMPRAS') {
            params.max = 1000
        }
        log.debug('List {}', params)
        def query = ComprobanteFiscal.where{ tipo == tipo}

        if(params.periodo) {
            def periodo = params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }

        // Si se tiene emisor
        def emisor = params.emisor
        if(emisor) {
            String search = '%' + emisor + '%'
            query = query.where { emisorNombre =~ search  }
        }

        respond query.list(params)
    }

    def xml(ComprobanteFiscal comprobanteFiscal) {
        if(comprobanteFiscal == null ){
            notFound()
            return
        }
        render (file: comprobanteFiscal.xml, contentType: 'text/xml',
                filename: comprobanteFiscal.fileName, encoding: "UTF-8")
    }

    def pdf(ComprobanteFiscal comprobanteFiscal) {
        if(comprobanteFiscal == null ){
            notFound()
            return
        }
        def pdf = comprobanteFiscal.pdf
        if(pdf == null) {
            notFound()
            return
        }
        render (file: pdf, contentType: 'application/pdf', filename: comprobanteFiscal.fileName)


    }

    def importarCfdi(){
        MultipartFile xml = request.getFile('xmlFile')
        if(xml == null){
            notFound()
            return
        }
        ComprobanteFiscal comprobanteFiscal = comprobanteFiscalService.buildFromXml(xml)
        respond comprobanteFiscal

    }


    def validar(ComprobanteFiscal cf){
        cf=comprobanteFiscalService.validar(cf)
        respond cf
    }

    def mostrarAcuse(ComprobanteFiscal cf){
        def acuse=comprobanteFiscalService.toAcuse(cf.acuse)
        def xml=comprobanteFiscalService.toXml(acuse)
        render(text: xml, contentType: "text/xml", encoding: "UTF-8")
    }

    def mostrarCfdi(ComprobanteFiscal cf){
        def xml=comprobanteFiscalService.getCfdiXml(cf)
        render(text: xml, contentType: "text/xml", encoding: "UTF-8")
    }

    def descargarCfdi(ComprobanteFiscal cf){
        response.setContentType("application/octet-stream")
        response.setHeader("Content-disposition", "attachment; filename=\"$cf.cfdiFileName\"")
        ByteArrayInputStream is=new ByteArrayInputStream(cf.xml)
        response.outputStream << is
    }


}
