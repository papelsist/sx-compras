package sx.cxp


import grails.rest.*
import grails.converters.*

class CuentaPorPagarController extends RestfulController {
    static responseFormats = ['json', 'xml']
    CuentaPorPagarController() {
        super(CuentaPorPagar)
    }

    def pendientesDeAnalisis() {
        String id = params.proveedorId
        List<CuentaPorPagar> res = CuentaPorPagar.where{proveedor.id == id && comprobanteFiscal.analizado == false}.list()
        respond res
    }
}
