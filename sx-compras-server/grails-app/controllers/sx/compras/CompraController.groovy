package sx.compras

import groovy.transform.ToString

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.web.databinding.WebDataBinding

import groovy.transform.CompileDynamic
import org.apache.commons.lang3.exception.ExceptionUtils

import static org.springframework.http.HttpStatus.OK

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
    protected void deleteResource(Compra resource) {
        resource.sw2 = resource.sucursal.nombre
        compraService.delete(resource.id)
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

    @CompileDynamic
    def depuracionBatch() {
        DepuracionBatch command = new DepuracionBatch()
        bindData command, getObjectToBind()
        log.info('Depuracion batch: {}', command)
        List<CompraDet> validList = command.partidas.findAll {it.pendiente != 0.0}
        Map<Compra, List<CompraDet>> grupos = validList.groupBy{it.compra}
        grupos.each {
            Compra compra = it.key
            List<CompraDet> rows = it.value
            rows.each { item -> 
                def depurar = item.pendiente
                if(depurar != 0) {
                    log.info('Depurando: {} Solicitado:{} Recibido: {} Depurando: {}', item.clave, item.solicitado, item.recibido, depurar)
                    item.depurado = depurar
                    item.depuracion = new Date()
                    // item.save flush: true
                }
            }
            def pendiente = compra.partidas.find{it.getPorRecibir()> 0.0 }
            compra.pendiente = pendiente != null
            compra.ultimaDepuracion = compra.partidas.sort{it.depuracion}.get(0).depuracion
            compraService.logEntity(compra)
            compra = compra.save flush: true
            log.info('Procesando Compra:{} Partidas:{}', it.key.folio, it.value.size())
        }
        respond status: OK
    }
    
    def handleException(Exception e) {  
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
    
}


// @ToString
class DepuracionBatch implements WebDataBinding {
    List<CompraDet> partidas

    String toString() {
        return "Partidas: ${partidas?.size()}"
    }
}

