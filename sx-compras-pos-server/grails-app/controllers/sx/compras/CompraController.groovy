package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.transform.CompileDynamic
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.AppConfig
import sx.core.Proveedor
import sx.core.Sucursal
import sx.reports.ReportService
import sx.utils.Periodo



@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class CompraController extends RestfulController<Compra> {

    static responseFormats = ['json']
    
    CompraService compraService
    ReportService reportService

    CompraController() {
        super(Compra)
    }
    @Override
    @CompileDynamic
    protected List<Compra> listAllResources(Map params) {
        Periodo periodo = params.periodo
        log.info('List {}', periodo)
        def query = Compra.where{}
        query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return  query.list([sort: 'lastUpdated', order: 'desc', max: 10000])
    }

    // @CompileDynamic
    def print( ) {
        Map repParams = [ID: params.id]
        repParams.CLAVEPROV = params.getBoolean('clavesProveedor', false)? 'SI' : 'NO'
        repParams.IMPRIMIR_COSTO = 'SI'
        def pdf =  reportService.run('Compra.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ListaDePrecios.pdf')
    }

    @CompileDynamic
    def partidas() {
        // log.info('Localizando partidas: {}', params)
        String xids = params.ids as String
        String[] ids = xids.split(',')
        String dd = ""
        def limit = ids.length - 1
        0.upto(limit, { item ->
            String rq = "'${ids[item]}'"
            dd += rq
            if(item < limit) {
                dd += ","
            }
        })
        String hql = "from CompraDet d where d.compra.id in(${dd})"
        def res = CompraDet.findAll(hql)
        respond res

    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}
