package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import sx.utils.Periodo


@GrailsCompileStatic
@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
class CuentaPorPagarController extends RestfulController<CuentaPorPagar> {
    static responseFormats = ['json']
    CuentaPorPagarController() {
        super(CuentaPorPagar)
    }

    @Override
    protected List<CuentaPorPagar> listAllResources(Map params) {
        log.info('List: {}', params)
        params.sort = 'fecha'
        params.order = 'desc'


        def tipo = params.tipo?: 'COMPRAS'
        def query = CuentaPorPagar.where {tipo == tipo}
        if(tipo == 'COMPRAS') {
            params.max = 500
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
}
