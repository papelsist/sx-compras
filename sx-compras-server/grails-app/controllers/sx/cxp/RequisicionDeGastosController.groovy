package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.rest.RestfulController

import grails.plugin.springsecurity.annotation.Secured
import groovy.transform.CompileDynamic
import sx.reports.ReportService

@Secured("ROLE_GASTOS")
@GrailsCompileStatic
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
        log.debug('List: {}', params)
        params.max = 500
        params.sort = 'lastUpdated'
        params.order = 'desc'
        def query = RequisicionDeGastos.where{}

        if(params.periodo) {
            def periodo = params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }
        def nombre = params.nombre
        if(nombre) {
            String search = nombre + '%'
            query = query.where { nombre =~ search  }
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
        // log.debug('Facturas pendientes {}', params)
        String id = params.proveedorId
        List<CuentaPorPagar> facturas = CuentaPorPagar
                .findAll("""
                 from CuentaPorPagar c where c.proveedor.id = ? and c.tipo = ?
                    and c.importePorPagar > 0 
                    and c not in(select d.cxp from RequisicionDet d where d.requisicion.proveedor = c.proveedor)
                    order by c.fecha desc
                 """,
                [id, 'GASTOS'], [max: 100])
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

    def print( ) {
        Map repParams = [ID: params.id]
        repParams.MONEDA = params.moneda
        def pdf =  reportService.run('Requisicion.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Requisicion.pdf')
    }
}
