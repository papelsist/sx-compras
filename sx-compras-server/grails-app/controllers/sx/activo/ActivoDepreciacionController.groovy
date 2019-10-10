package sx.activo

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.reports.ReportService
import sx.utils.Periodo


@Slf4j
@Secured(['ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
// @GrailsCompileStatic
class ActivoDepreciacionController extends RestfulController<ActivoDepreciacion> {

	ActivoDepreciacionService activoDepreciacionService

    static responseFormats = ['json']
    
    ActivoDepreciacionController() {
        super(ActivoDepreciacion)
    }

    @Override
    protected List<ActivoDepreciacion> listAllResources(Map params) {
        log.info('List {}', params)
        Long activoId = params['activoFijoId'] as Long
        def query = ActivoDepreciacion.where{activoFijo.id == activoId}
        return  query.list()
    }

    @Override
    def save() {
        ActivoFijo af = ActivoFijo.get(params.activoFijoId)
        ActivoDepreciacion resource = new ActivoDepreciacion()
        bindData resource, getObjectToBind()
        resource.ejercicio = Periodo.obtenerYear(resource.corte)
        resource.mes = Periodo.obtenerMes(resource.corte) + 1
        // log.info('Generando depreciacion para activo: {} {}', af, resource)
        respond activoDepreciacionService.generarDepreciacionUnitaria(af, resource.ejercicio, resource.mes)
    }

    @Override
    protected ActivoDepreciacion createResource() {
        ActivoFijo af = ActivoFijo.get(params.activoFijoId)
        ActivoDepreciacion resource = new ActivoDepreciacion()
        resource.ejercicio = Periodo.obtenerYear(af.corte)
        resource.mes = Periodo.obtenerMes(af.corte) + 1
        resource.activoFijo = af
        resource.tasaDepreciacion = af.tasaDepreciacion
        resource.depreciacionAcumulada = af.depreciacionAcumulada
        return resource
    }

    @Override
    protected ActivoDepreciacion saveResource(ActivoDepreciacion resource) {
        return activoDepreciacionService.save(resource)
    }

    def depreciacionBatch(Integer ejercicio, Integer mes) {
        respond activoDepreciacionService.generarDepreciacionBatch(ejercicio, mes)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }
}
