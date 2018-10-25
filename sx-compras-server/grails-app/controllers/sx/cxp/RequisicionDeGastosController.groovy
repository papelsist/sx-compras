package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.rest.RestfulController

import grails.plugin.springsecurity.annotation.Secured
import grails.validation.Validateable
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.reports.ReportService
import sx.tesoreria.CuentaDeBanco
import sx.utils.Periodo

@Secured(['ROLE_GASTOS', 'ROLE_TESORERIA'])
@GrailsCompileStatic
@Slf4j
class RequisicionDeGastosController extends RestfulController<RequisicionDeGastos> {

    static responseFormats = ['json']

    RequisicionDeGastosService requisicionDeGastosService

    ReportService reportService

    RequisicionDeGastosController() {
        super(RequisicionDeGastos)
    }



    @Override
    @CompileDynamic
    protected List<RequisicionDeGastos> listAllResources(Map params) {
        params.sort = 'fecha'
        params.order = 'desc'
        params.max = params.registros?: 10
        log.info('List: {}', params)
        def query = RequisicionDeGastos.where{}

        Boolean pendientes = this.params.getBoolean('pendientes')
        if(pendientes) {
            query = query.where {egreso == null}
        }

        if(params.periodo) {
            def periodo = params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }
        if(params.proveedor) {
            query = query.where {proveedor.id == params.proveedor}
        }
        if(this.params.getBoolean('cerradas')) {
            query = query.where{cerrada != null}
        }
        return query.list(params)
    }

    @Override
    protected RequisicionDeGastos saveResource(RequisicionDeGastos resource) {
        return requisicionDeGastosService.save(resource)
    }

    @Override
    protected RequisicionDeGastos updateResource(RequisicionDeGastos resource) {
        return requisicionDeGastosService.update(resource)
    }

    /**
     * Elimina la requisicion
     *
     * @param resource
     */
    @Override
    protected void deleteResource(RequisicionDeGastos resource) {
        requisicionDeGastosService.delete(resource)
    }

    @CompileDynamic
    protected RequisicionDeGastos createResource() {
        RequisicionDeGastos res = new RequisicionDeGastos()
        bindData res, getObjectToBind()
        res.folio = 0L
        res.createUser = 'TEMPO'
        res.updateUser = 'TEMPO'
        if(!res.nombre)
            res.nombre = res.proveedor.nombre
        return res
    }


    /**
     *
     * @return La Lista de facturas pendientes
     * @TODO Modificar el hql query para contemplar solo las analizadas y descriminar
     * las ya incluidas en una requisicion
     */
    def pendientes() {
        log.debug('Facturas pendientes {}', params)
        String id = params.proveedorId
        List<CuentaPorPagar> facturas = CuentaPorPagar
                .findAll("""
                 from CuentaPorPagar c 
                  where c.proveedor.id = ? 
                    and c.tipo = ?
                    and c.importePorPagar > 0 
                    and c not in(select d.cxp from RequisicionDet d where d.requisicion.proveedor = c.proveedor)
                    order by c.fecha desc
                 """,
                [id, 'GASTOS'], [max: 100])
        log.info("Facturas localizadas: {}", facturas.size())
        respond facturas
    }

    def cerrar(RequisicionDeGastos requisicion) {
        if(requisicion == null) {
            notFound()
            return
        }
        requisicion = requisicionDeGastosService.cerrar(requisicion)
        respond requisicion
    }


    def pendientesDePago() {
        log.debug('Pendientes de pago: {}', params)
        params.sort = 'fecha'
        params.order = 'desc'
        params.max = params.registros?: 10
        def query = RequisicionDeGastos.where{egreso == null && cerrada != null}

        Periodo periodo = (Periodo)params['periodo']
        if(periodo) {
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }
        String proveedorId = params['proveedor']
        if(proveedorId) {
            query = query.where {proveedor.id == proveedorId}
        }
        return query.list(params)
    }

    def print( ) {
        Map repParams = [ID: params.id]
        repParams.MONEDA = params.moneda
        def pdf =  reportService.run('Requisicion.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Requisicion.pdf')
    }




    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, e)
        respond([message: message], status: 500)
    }

}




