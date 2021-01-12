package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.util.logging.Slf4j
import org.springframework.transaction.annotation.Transactional

import static org.springframework.http.HttpStatus.CREATED

@Slf4j
// @GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CatalogoDeCuentasController extends RestfulController<CatalogoDeCuentas> {

    static responseFormats = ['json']

    CatalogoDeCuentasService catalogoDeCuentasService

    CatalogoDeCuentasController() {
        super(CatalogoDeCuentas)
    }

    def index() {

        if(params.empresa) {
            EcontaEmpresa emp = EcontaEmpresa.get(params.empresa)
            log.debug('Cargando registros de XML CatalogoCuentas para: {}', emp.razonSocial)
            List<CatalogoDeCuentas> catalogos = CatalogoDeCuentas.where {
                empresa == emp
            }.list(params)
            respond catalogos
        } else {
            // List<CatalogoDeCuentas> catalogos = CatalogoDeCuentas.list(params)
            List data = []
            respond data
        }
    }

    @Transactional
    def save(CatalogoCreateCmd command) {
        log.debug('Generando catalogo SAT {}', params)
        if(command == null) {
            notFound()
            return
        }
        CatalogoDeCuentas catalogo = this.catalogoDeCuentasService.generar(
                command.empresa,
                command.ejercicio,
                command.mes)
        respond catalogo, [status: CREATED, view:'show']
    }

    /*
    @Override
    protected CatalogoDeCuentas createResource() {
        CatalogoDeCuentas instance = resource.newInstance()
        bindData instance, getObjectToBind()
        instance = catalogoDeCuentasService.generar(instance.ejercicio, instance.mes)
        instance
    }
     */

    /*
    @Override
    protected CatalogoDeCuentas saveResource(CatalogoDeCuentas resource) {
        return catalogoDeCuentasService.save(resource)
    }
     */

    def mostrarXml(CatalogoDeCuentas bitacora) {
        if(bitacora == null ){
            notFound()
            return
        }
        byte[] xml = bitacora.readXml().getBytes('UTF-8')
        render (file: xml, contentType: 'text/xml',
                filename: "CatalogoDeCtasBitacora_${bitacora.id}", encoding: "UTF-8")
    }

    def mostrarAcuse(CatalogoDeCuentas bitacora) {
        if(bitacora == null ){
            notFound()
            return
        }
        render (file: bitacora.readXml(), contentType: 'text/xml',
                filename: "Acuse_CatalogoDeCtasBitacora_${bitacora.id}", encoding: "UTF-8")
    }

    def descargarXml(CatalogoDeCuentas cf){
        response.setContentType("text/xml")
        response.setCharacterEncoding('UTF-8')

        def co =  grailsApplication.config
        def encoding = co.getProperty('grails.converters.encoding', String, 'UTF-8')
        def fileName = cf.fileName
        // response.contentType = "${xlsxMimeType}; charset=${encoding}"
        response.addHeader('File-Names', fileName)
        response.setHeader "Content-disposition", "attachment; filename=${fileName}"


        ByteArrayInputStream is=new ByteArrayInputStream(cf.xmlUrl.getBytes())
        response.outputStream << is
    }

    def uploadAcuse() {
        log.debug('Uploading Acuse params:{}',params)

        EcontaUploadCommand cmd = new EcontaUploadCommand()
        bindData(cmd, request)

        if(cmd.hasErrors()) {
            respond cmd.errors
            return
        }

        log.debug('Documento: {}', cmd)
        log.debug('File: {}', cmd.file)
        CatalogoDeCuentas cat = this.catalogoDeCuentasService.saveAcuse(cmd)
        respond cat, view: 'show'
    }
}

class CatalogoCreateCmd {
    EcontaEmpresa empresa
    Integer ejercicio
    Integer mes
}
