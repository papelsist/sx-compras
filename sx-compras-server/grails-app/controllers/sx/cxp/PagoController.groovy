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

        params.sort = 'fecha'
        params.order = 'desc'
        params.max = params.registros?: 10
        log.debug('List: {}', params)
        String ser = params.serie ?: 'RequisicionDeCompras'

        def query = Pago.where{serie == ser}

        Boolean disponibles = this.params.getBoolean('porAplicar', false)
        if(disponibles) {
            query = query.where{disponible > 0.0}
        }

        Boolean reciboPendiente = this.params.getBoolean('reciboPendiente', false)
        if(reciboPendiente) {
            query = query.where{comprobanteFiscal == null}
        }

        if(params.periodo) {
            def periodo = (Periodo)params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }
        if(params.proveedor) {
            query = query.where {proveedor.id == params.proveedor}
        }

        return query.list(params)

    }

    def show() {
        Pago pago = Pago.get(params.id.toString())
        pago.aplicaciones = AplicacionDePago.where{pago == pago}.list()
        respond pago
    }

    def aplicar(Pago pago) {
        pagoService.aplicarPago(pago)
        forward action: 'show', params: params
    }
}

