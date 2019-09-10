package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController

import groovy.util.logging.Slf4j
import groovy.transform.ToString

import sx.core.AppConfig
import sx.core.Proveedor
import sx.reports.ReportService
import sx.utils.Periodo

@Secured("ROLE_COMPRAS")
@Slf4j
class AlcancesController extends RestfulController<Alcance>{

    static responseFormats = ['json']

    AlcancesService alcancesService

    ReportService reportService

    public AlcancesController(){
        super(Alcance)
    }

    def list() {
        def query = Alcance.where{fecha == new Date()&& comentario == null}
        respond query.list()
    }

    def generar(GenerarAlcanceCommand command) {
        log.debug('Generando alcance: {}', command)
        def rows = alcancesService.generar(command.fechaInicial, command.fechaFinal, command.meses)
        respond rows
    }

    def generarOrden(GenerarOrdenCommand command) {
        log.debug('Generando orden de compra {}', command)
        Compra compra = alcancesService.generarOrden(command.proveedor, command.partidas)
        respond compra
    }

    def actualizarMeses(){
        int meses = params.int('meses', 2)
        log.debug('Actualizando meses: {} ', meses)
        def res = alcancesService.actualizarMeses(meses)
        Map data = ['updated': res]
        log.debug('Act: ', data)
        respond data, status:200
    }

    def comprasPendientes() {
        String clave = params.clave
        respond alcancesService.comprasPendientes(clave)
    }

    def print( ) {
        //params.ID = params.id;
        Periodo periodo = params.periodo
        // periodo.properties = params
        log.info('Reporte: {}', params)
        params.SUCURSAL = '%'
        params.FECHA_INI = periodo.fechaInicial
        params.FECHA_FIN = periodo.fechaFinal
        params.MESES = params.getDouble('MESES')
        params.MESESF = params.getDouble('MESESF')
        def pdf =  reportService.run('compras/GeneralDeAlcance.jrxml', params)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'OrdenDeCompraSuc.pdf')
    }
}

@ToString(includeNames=true,includePackage=false)
class GenerarAlcanceCommand {
    Date fechaInicial
    Date fechaFinal
    Integer meses
}

class GenerarOrdenCommand {

    String proveedor

    List<Alcance> partidas

    String toString() {
        return "Generando Orden de compra para ${proveedor} con ${partidas.size()} registros de alcance"
    }
}
