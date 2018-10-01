package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.core.Proveedor
import sx.utils.Periodo

@Slf4j()
@Secured(['ROLE_COMPRAS', 'ROLE_GASTOS'])
@GrailsCompileStatic
class PagoController extends RestfulController<Pago> {

    static responseFormats = ['json']

    PagoService pagoService

    PagoController() {
        super(Pago)
    }


    @Override
    protected List<Pago> listAllResources(Map params) {
        log.debug('List: {}', params)
        params.sort = 'fecha'
        params.order = 'desc'
        params.max = params.registros?: 10
        def query = Pago.where{}

        if(params.periodo) {
            def periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }
        if(params.proveedor) {
            query = query.where {proveedor.id == params.proveedor}
        }
        log.info('List: {}', params)
        return query.list(params)

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

