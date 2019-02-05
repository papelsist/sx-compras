package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class BalanzaSatController extends RestfulController<BalanzaSat> {

    static responseFormats = ['json']

    BalanzaSatService balanzaSatService

    BalanzaSatController() {
        super(BalanzaSat)
    }

    @Override
    protected BalanzaSat createResource() {
        BalanzaSat instance = resource.newInstance()
        bindData instance, getObjectToBind()
        instance = balanzaSatService.generar(instance.ejercicio, instance.mes)
        instance
    }

    @Override
    protected BalanzaSat saveResource(BalanzaSat resource) {
        return balanzaSatService.save(resource)
    }

    @Override
    protected BalanzaSat updateResource(BalanzaSat resource) {
        return resource  // ReadOnly safe
    }

    def mostrarXml(BalanzaSat balanza) {
        if(balanza == null ){
            notFound()
            return
        }
        render (file: balanza.xml, contentType: 'text/xml',
                filename: "CatalogoDeCtasBitacora_${balanza.id}", encoding: "UTF-8")
    }

    def mostrarAcuse(BalanzaSat bitacora) {
        if(bitacora == null ){
            notFound()
            return
        }
        render (file: bitacora.acuse, contentType: 'text/xml',
                filename: "Acuse_CatalogoDeCtasBitacora_${bitacora.id}", encoding: "UTF-8")
    }

    def descargarXml(BalanzaSat balanza){
        if(balanza == null ){
            notFound()
            return
        }
        def co =  grailsApplication.config
        def encoding = co.getProperty('grails.converters.encoding', String, 'UTF-8')
        response.setContentType("text/xml")
        response.setCharacterEncoding('UTF-8')
        response.contentType = "text/xml; charset=${encoding}"
        response.setHeader "Content-disposition", "attachment; filename=${balanza.fileName}"


        // ByteArrayInputStream is=new ByteArrayInputStream(balanza.xml)

        response.outputStream << balanza.readXml().getBytes('UTF-8')
    }
}
