package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CatalogoDeCuentasController extends RestfulController<CatalogoDeCuentas> {

    static responseFormats = ['json']

    CatalogoDeCuentasService catalogoDeCuentasService

    CatalogoDeCuentasController() {
        super(CatalogoDeCuentas)
    }

    @Override
    protected CatalogoDeCuentas createResource() {
        CatalogoDeCuentas instance = resource.newInstance()
        bindData instance, getObjectToBind()
        instance = catalogoDeCuentasService.generar(instance.ejercicio, instance.mes)
        instance
    }

    @Override
    protected CatalogoDeCuentas saveResource(CatalogoDeCuentas resource) {
        return catalogoDeCuentasService.save(resource)
    }

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
        def fileName = catalogoDeCuentasService.getFileName(cf)
        // response.contentType = "${xlsxMimeType}; charset=${encoding}"
        response.setHeader "Content-disposition", "attachment; filename=${fileName}"


        ByteArrayInputStream is=new ByteArrayInputStream(cf.xmlUrl.getBytes())
        response.outputStream << is
    }
}
