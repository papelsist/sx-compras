package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*


@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class ProveedorSaldoController extends RestfulController<ProveedorSaldo> {
    static responseFormats = ['json']

    ProveedorSaldoController() {
        super(ProveedorSaldo)
    }

    @Override
    protected List<ProveedorSaldo> listAllResources(Map params) {
        String id = params.proveedorId
        return ProveedorSaldo.where{proveedor.id == id}.list([sort: 'ejercicio','order': 'desc'])
    }
}
