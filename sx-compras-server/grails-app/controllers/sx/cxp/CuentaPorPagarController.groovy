package sx.cxp

import groovy.transform.Canonical
import groovy.util.logging.Slf4j


import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.validation.Validateable

import org.apache.commons.lang3.exception.ExceptionUtils


import sx.utils.Periodo
import sx.core.LogUser
import sx.core.Proveedor



@Slf4j
@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CuentaPorPagarController extends RestfulController<CuentaPorPagar> implements LogUser{
    
    static responseFormats = ['json']

    CuentaPorPagarService cuentaPorPagarService

    
    
    CuentaPorPagarController() {
        super(CuentaPorPagar)
    }

    @Override
    protected CuentaPorPagar updateResource(CuentaPorPagar resource) {
        logEntity(resource)
        resource = resource.save flush: true
        return resource
    }


    @Override
    protected List<CuentaPorPagar> listAllResources(Map params) {
        log.info('List: {}', params)
        params.sort = 'fecha'
        params.order = 'desc'
        params.max = params.registros ?: 5000
        
        def query = CuentaPorPagar.where {}
        def tipo = params.tipo?: 'COMPRAS'

        if(tipo == 'COMPRAS') {
            query = query.where {tipo == 'COMPRAS'}   
        } else {
            query = query.where {tipo != 'COMPRAS'}   
        }

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }

        if(params.proveedor) {
            query = query.where {proveedor.id == params.proveedor}
        }
        return query.list(params)
    }

    def cartera() {
        log.info('Cargando la cartera de CXP: {}', params)
        def tpo = params.tipo
        def inicial = Date.parse('dd/MM/yyyy','31/12/2017')
        def query = CuentaPorPagar.where { fecha > inicial && tipo == tpo && saldoReal > 0.0 }
        List<CuentaPorPagar> data = query.list([sort: 'nombre'])
        respond data, view: 'index'
    }

    @CompileDynamic
    def estadoDeCuenta() {
        def proveedor = Proveedor.get(params.proveedorId)
        def periodo = params.periodo 
        EstadoDeCuentaProveedor estado = cuentaPorPagarService.estadoDeCuenta(proveedor, periodo)
        respond estado
    }

    def pendientesDeAnalisis() {
        String id = params.proveedorId
        List<CuentaPorPagar> res = CuentaPorPagar.where{proveedor.id == id && analizada == false}.list()
        respond res
    }

    def pendientes() {
        String id = params.proveedorId
        List<CuentaPorPagar> res = CuentaPorPagar
                .findAll("from CuentaPorPagar c where c.proveedor.id = ? and c.total - c.pagos > 0",
                [id])
        respond res
    }

    @CompileDynamic
    def facturas() {
        String proveedorId = params.proveedorId
        def periodo = params.periodo 
        List<CuentaPorPagar> res = cuentaPorPagarService.buscarFacturas(proveedorId, periodo)
        respond res, view: 'index'
    }

    def saldar(CuentaPorPagar cxp) {
        if(cxp == null) {
            notFound()
            return
        }
        if(cxp.saldoReal > 0.0 && cxp.saldoReal <= 10.00) {
            cxp.diferencia = cxp.saldoReal
            logEntity(cxp)
            cxp.save flush: true
        }
        respond cxp 
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

@Canonical()
class EstadoDeCuentaProveedor {
    Proveedor proveedor
    Periodo periodo
    BigDecimal saldoInicial = 0.0
    BigDecimal cargos
    BigDecimal abonos
    BigDecimal saldoFinal = 0.0
    Set<EstadoDeCuentaRow> movimientos

    BigDecimal sumCargos() {
        def res = movimientos.sum 0.0, {it.importe > 0.0 ? it.importe : 0.0}
        return res
    }

    BigDecimal sumAbonos() {
        def res = movimientos.sum 0.0, {it.importe < 0.0 ? it.importe : 0.0}
        return res
    }
    
}

@Canonical(excludes = ['saldo'])
class EstadoDeCuentaRow implements  Validateable {
    
    String id
    String nombre
    String serie
    String folio
    String tipo
    Date fecha
    String moneda
    BigDecimal tipoDeCambio = 1.0
    BigDecimal importe = 0.0
    BigDecimal saldo = 0.0
    String comentario
}


