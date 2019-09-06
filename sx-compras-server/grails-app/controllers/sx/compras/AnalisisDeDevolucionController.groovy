package sx.compras

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class AnalisisDeDevolucionController extends RestfulController<AnalisisDeDevolucion> {
    
    static responseFormats = ['json']

    ReportService reportService

    AnalisisDeDevolucionService analisisDeDevolucionService

    AnalisisDeDevolucionController() {
        super(AnalisisDeDevolucion)
    }

    @Override
    protected List<AnalisisDeDevolucion> listAllResources(Map params) {
        log.info('List {}', params)
        Long notaId = params['notaId'] as Long
        def query = AnalisisDeDevolucion.where{nota.id == notaId}
        return  query.list()
    }

    @Override
    protected AnalisisDeDevolucion createResource() {
        AnalisisDeDevolucion resource  = new AnalisisDeDevolucion()
        bindData resource, getObjectToBind()
        resource.with {
        	nombre = resource.nota.nombre
        	folio = resource.nota.folio
        	serie = resource.nota.serie
        	clave = resource.dec.producto.clave
			descripcion = resource.dec.producto.descripcion
			cantidad = resource.dec.cantidad
        }
        return resource
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }


}
