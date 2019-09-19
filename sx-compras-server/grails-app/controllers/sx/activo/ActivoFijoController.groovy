package sx.activo

import groovy.util.logging.Slf4j

import grails.rest.RestfulController
import grails.plugin.springsecurity.annotation.Secured
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.reports.ReportService



@Slf4j
@Secured(['ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
@GrailsCompileStatic
class ActivoFijoController extends RestfulController<ActivoFijo> {
    
    static responseFormats = ['json']

    ActivoFijoService activoFijoService

    ActivoDepreciacionFiscalService activoDepreciacionFiscalService

    DepreciacionAnalisisService depreciacionAnalisisService

    ActivoFijoController() {
        super(ActivoFijo)
    }

    @Override
    protected List<ActivoFijo> listAllResources(Map params) {
        log.info('List {}', params)
        def query = ActivoFijo.where{}
        return  query.list([sort: 'adquisicion', order: 'desc'])
    }

    @Override
    protected ActivoFijo createResource() {
        ActivoFijo activo = new ActivoFijo()
        bindData activo, getObjectToBind()
        return activo
    }

    @Override
    protected ActivoFijo saveResource(ActivoFijo resource) {
        return activoFijoService.save(resource)
    }

    @Override
    protected ActivoFijo updateResource(ActivoFijo resource) {
        return activoFijoService.update(resource)
    }

    @CompileDynamic
    def generarPendientes() {
        respond activoFijoService.generarPendientes()
    }

    def asignarInpcMedioMesUso() {
        def command = new AsignacionInpc()
        bindData command, getObjectToBind()
        respond activoFijoService.asignarInpcMedioMesUso(command.ids, command.inpc)
    }

    @CompileDynamic
    def generarDepreciacionFiscal(Integer ejercicio) {
        def res  = activoDepreciacionFiscalService.generarDepreciacion(ejercicio)
        respond res
    }

    @CompileDynamic
    def generarResumen(Integer ejercicio, Integer mes) {
        def res  = depreciacionAnalisisService.generar(ejercicio, mes)
        respond res
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }


}

class AsignacionInpc {
    List ids
    BigDecimal inpc
}
