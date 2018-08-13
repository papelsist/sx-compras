package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j

@Slf4j()
@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class PagoController extends RestfulController<Pago> {
    static responseFormats = ['json']
    PagoService pagoService
    PagoController() {
        super(Pago)
    }

    @Override
    protected List<Pago> listAllResources(Map params) {
        def query = Pago.where{}
        return query.list([sort: 'folio', order: 'asc'])

    }

    def show() {
        Pago pago = Pago.get(params.id.toString())
        pago.aplicaciones = AplicacionDePago.where{pago == pago}.list()
        respond pago
    }

    def aplicar() {
        pagoService.aplicarPago(params.id.toString())
        forward action: 'show', params: params
    }
}
