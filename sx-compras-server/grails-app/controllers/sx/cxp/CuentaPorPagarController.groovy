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
        log.debug('List {}', params)
        params.max = 200
        params.sort = 'lastUpdated'
        params.order = 'desc'
        def query = CuentaPorPagar.where {}
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }
        return query.list(params)
    }

    def pendientesDeAnalisis() {
        String id = params.proveedorId
        List<CuentaPorPagar> res = CuentaPorPagar.where{proveedor.id == id && analizada == false}.list()
        respond res
    }
}
