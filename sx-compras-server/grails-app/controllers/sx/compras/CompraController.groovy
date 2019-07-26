package sx.compras

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.transform.CompileDynamic
import org.apache.commons.lang3.exception.ExceptionUtils
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

    @CompileDynamic
    def update() {
        String id = params.id as String
        Compra compra = Compra.get(id)
        bindData compra, getObjectToBind()
        compra = compraService.saveCompra(compra)
        respond compra, view: 'show'
    }


    @Override
    protected Compra createResource() {
        def instance = new Compra()
        bindData instance, getObjectToBind()
        instance.folio = 0L
        instance.centralizada = true
        if(instance.sucursal == null)
            instance.sucursal = Sucursal.where { clave == 1}.find()
        return instance
    }

    @Override
    protected Compra saveResource(Compra resource) {
        return compraService.saveCompra(resource)
    }

    @Override
    @CompileDynamic
    protected List<Compra> listAllResources(Map params) {
        Periodo periodo = params.periodo
        log.info('List {}', periodo)
        def query = Compra.where{}
        query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        return  query.list([sort: 'lastUpdated', order: 'desc'])
    }

    
    @CompileDynamic
    protected List<Compra> listAllResourcesOld(Map params) {

        params.max = params.registros?: 20
        params.sort = 'lastUpdated'
        params.order = 'desc'

        log.info('List {}', params)

        def query = Compra.where{}
        def pendientes = this.params.getBoolean('pendientes')

        if(pendientes){ 
            params.max = 10000
            query = query.where{ pendiente == true}
            return query.list(params)
        }

        if(params.periodo) {
            Periodo periodo = params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        if(params.proveedor) {
            String provId = params.proveedor
            query = query.where { proveedor.id == provId}
        }
        
        return  query.list(params)
    }


    def pendientes() {
        params.sort = 'lastUpdatred'
        params.order = 'desc'
        respond Compra.where{pendiente == true}.list(params)
    }

    @CompileDynamic
    def cerrar(Compra compra) {
        if(compra == null) {
            notFound()
            return
        }
        def res = compraService.cerrarCompra(compra)
        respond res, view: 'show'
    }

    @CompileDynamic
    def depurar(Compra compra) {
        if(compra == null) {
            notFound()
            return
        }
        def res = compraService.depurarCompra(compra)
        respond res, view: 'show'
    }

    @CompileDynamic
    def actualizarPrecios(Compra compra) {
        if(compra == null) {
            notFound()
            return
        }
        def res = compraService.actualizarPreciosVigentes(compra)
        respond res, view: 'show'
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
        log.info('Localizando partidas: {}', params)
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
