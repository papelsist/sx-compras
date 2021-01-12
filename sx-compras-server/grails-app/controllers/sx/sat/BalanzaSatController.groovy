package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import org.springframework.transaction.annotation.Transactional

import static org.springframework.http.HttpStatus.CREATED

@Slf4j
// @GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class BalanzaSatController extends RestfulController<BalanzaSat> {

    static responseFormats = ['json']

    BalanzaSatService balanzaSatService

    BalanzaSatController() {
        super(BalanzaSat)
    }

    def index() {
        log.debug('BalanzaSat List params: {}', params)
        if(params.empresa) {
            EcontaEmpresa emp = EcontaEmpresa.get(params.empresa)
            log.debug('Cargando registros de Balanza SAT para: {}', emp.razonSocial)
            List<BalanzaSat> balanzas = BalanzaSat.where {
                empresa == emp
            }.list(params)
            respond balanzas
        } else {
            List data = []
            respond data
        }
    }

    @Transactional
    def save(CatalogoCreateCmd command) {
        log.debug('Generando balanza SAT {}', params)
        if(command == null) {
            notFound()
            return
        }
        BalanzaSat balanzaSat = this.balanzaSatService.generar(
                command.empresa,
                command.ejercicio,
                command.mes)
        respond balanzaSat, [status: CREATED, view:'show']
    }

    def mostrarXml(BalanzaSat balanza) {
        if(balanza == null ){
            notFound()
            return
        }

        render (file: balanza.xmlUrl.getBytes(), contentType: 'text/xml',
                filename: "BalanzaSatBitacora_${balanza.id}", encoding: "UTF-8")
    }

    def mostrarAcuse(BalanzaSat bitacora) {
        if(bitacora == null ){
            notFound()
            return
        }
        render (file: bitacora.readXml(), contentType: 'text/xml',
                filename: "Acuse_BalanzaSatBitacora_${bitacora.id}", encoding: "UTF-8")
    }

    def descargarXml(BalanzaSat balanza){
        if(balanza == null ){
            notFound()
            return
        }
        log.debug('Descargando balanza: ', balanza.xmlUrl.path)
        def co =  grailsApplication.config
        def encoding = co.getProperty('grails.converters.encoding', String, 'UTF-8')
        response.setContentType("text/xml")
        response.setCharacterEncoding('UTF-8')
        response.contentType = "text/xml; charset=${encoding}"
        response.setHeader "Content-disposition", "attachment; filename=${balanza.fileName}"
        response.outputStream << balanza.xmlUrl.getBytes()
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        e.printStackTrace()
        respond([message: message], status: 500)
    }
}
