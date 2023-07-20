package sx.sat

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import static org.springframework.http.HttpStatus.*

import org.apache.commons.lang3.exception.ExceptionUtils


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j



@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class SatMetadataProveedorController extends RestfulController<SatMetadataProveedor> {
    
    static responseFormats = ['json']

    SatMetadataProveedorService satMetadataProveedorService

    SatMetadataProveedorController() {
        super(SatMetadataProveedor)
    }

    @Override
    protected List<SatMetadataProveedor> listAllResources(Map params) {
        log.info('List: {}', params)
        println "Cargando metadata para proveedor para  ${params.ejercicio} - ${params.mes} "
        def ej = params.ejercicio
        def ms = params.mes
        def query =  SatMetadataProveedor.where{ejercicio == ej && mes == ms}
        def res = query.list([sort: 'fechaEmision', order: 'asc'])
        //println res
        return res
    }

    def List<SatMetadataProveedor> metaDataProveedorList(params) {
        log.info('List: {}', params)
        println "Cargando metadata de proveedor para  ${params.ejercicio} - ${params.mes} desde metadata list "
        def ej = params.ejercicio
        def ms = params.mes
        def query =  SatMetadataProveedor.where{ejercicio == ej && mes == ms}.findAll()
    
        println query.size
        respond query
    }


    def importar(Integer ejercicio, Integer mes) {
        println "Importando El metadata de proveedores para ${ejercicio} - ${mes}"
        satMetadataProveedorService.importar()
        satMetadataProveedorService.validar(ejercicio, mes)
        render status: NO_CONTENT
        //respond []
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
