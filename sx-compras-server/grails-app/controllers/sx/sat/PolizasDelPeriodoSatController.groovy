package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.util.logging.Slf4j
import lx.econta.polizas.TipoSolicitud
import sx.core.Empresa

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class PolizasDelPeriodoSatController extends RestfulController<PolizasDelPeriodoSat> {

    static responseFormats = ['json']

    PolizasDelPeriodoSatService polizasDelPeriodoSatService

    PolizasDelPeriodoSatController() {
        super(PolizasDelPeriodoSat)
    }

    @Override
    protected PolizasDelPeriodoSat createResource() {
        PolizasDelPeriodoSat instance = resource.newInstance()
        bindData instance, getObjectToBind()
        log.info('Params: {}', params)
        log.info('Resoure : {}', instance)
        instance = polizasDelPeriodoSatService.generar(instance)
        instance
    }

    @Override
    protected PolizasDelPeriodoSat saveResource(PolizasDelPeriodoSat resource) {
        return polizasDelPeriodoSatService.save(resource)
    }

    @Override
    protected PolizasDelPeriodoSat updateResource(PolizasDelPeriodoSat resource) {
        return resource  // ReadOnly safe
    }

    def mostrarXml(PolizasDelPeriodoSat polizas) {
        if(polizas == null ){
            notFound()
            return
        }
        // String xmlData = polizasDelPeriodoSatService.readXml(polizas)
        // render (text: xmlData, contentType: 'text/xml', encoding: 'UTF-8')
        render (file: polizasDelPeriodoSatService.findXmlFile(polizas),
                contentType: 'text/xml',
                filename: "${polizas.fileName}", encoding: "UTF-8")
    }

    def mostrarAcuse(PolizasDelPeriodoSat bitacora) {
        if(bitacora == null ){
            notFound()
            return
        }
        render (file: bitacora.acuse, contentType: 'text/xml',
                filename: "Acuse_CatalogoDeCtasBitacora_${bitacora.id}", encoding: "UTF-8")
    }

    def descargarXml(PolizasDelPeriodoSat polizas){
        if(polizas == null ){
            notFound()
            return
        }
        def co =  grailsApplication.config
        def encoding = co.getProperty('grails.converters.encoding', String, 'UTF-8')
        String xmlData = polizasDelPeriodoSatService.readXml(polizas)
        response.setContentType("text/xml")
        response.setCharacterEncoding('UTF-8')
        response.contentType = "text/xml; charset=${encoding}"
        response.setHeader "Content-disposition", "attachment; filename=${polizas.fileName}"

        response.outputStream << xmlData.getBytes('UTF-8')
    }
}


