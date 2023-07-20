package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.util.Environment

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.logistica.InventarioService
import sx.reports.ReportService
import sx.utils.Periodo
import groovy.transform.ToString

@GrailsCompileStatic
@Slf4j
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class ExistenciaController extends RestfulController<Existencia> {
    
    static responseFormats = ['json']

    ReportService reportService

    ExistenciaService existenciaService

    InventarioService inventarioService
    
    ExistenciaController() {
        super(Existencia)
    }

    def test(){
        //def fechaFinal = params.fechaFinal
        print('Reporte Por Semana: '+ params)
        //print(fechaFinal)
    }

    @Override
    @CompileDynamic
    protected List<Existencia> listAllResources(Map params) {
        params.sort = 'clave'
        params.order = 'asc'
        params.max = 100
        log.info('List {}', params)
        
        def ej = params.ejercicio?: Periodo.currentYear()
        def mes = params.mes?: Periodo.currentMes()
        def query = Existencia.where{ anio ==  ej && mes == mes}
        return  query.list(params)
    }

    def crossTab() {
        respond inventarioService.existenciasCrossTab()
    }

    def existenciaSemana(ExistenciaCommand command){
        params.FECHA_FIN = command.fechaFinal
        println(params)
        println("Command")
        println(command)
        def pdf =  reportService.run('ExistenciaSemanal.jrxml', params)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ExistenciasSemanal.pdf')
    }

    def alcanceSimpleCrossTab() {
        int meses = params.int('meses', 2)
        respond inventarioService.alcanceSimpleCrossTab(meses)
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }

}


    @ToString(includeNames=true,includePackage=false)
    class ExistenciaCommand {
        Date fechaFinal
    }