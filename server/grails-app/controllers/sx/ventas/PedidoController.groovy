package sx.ventas


import grails.rest.*
import grails.converters.*
import sx.core.AppConfig
import sx.core.Venta

class PedidoController extends RestfulController {

    static responseFormats = ['json']

    PedidoController() {
        super(Venta)
    }



    @Override
    protected List listAllResources(Map params) {
        log.debug('List {}', params)
        params.max = Math.min(params.max ?: 10, 100)
        params.sort = params.sort?: 'lastUpdated'
        params.order = params.order?: 'desc'

        def query = Venta.where {cuentaPorCobrar == null && facturar == null && sucursal == params.sucursal}
        if (params.tipo == 'CREDITO') {
            query = query.where {facturar !=  null  && cuentaPorCobrar == null}
            if(params.facturables == 'CRE'){
                query = query.where {tipo == params.facturables}
            } else {
                query = query.where {tipo != 'CRE'}
            }
        }
        if( params.term && params.term.isInteger()){
            // log.debug('Buscando por Folio: ', params.folio.toInteger())
            query = query.where { documento == params.documento.toInteger() }
        } else  if( params.term) {
            String search = '%' + params.term + '%'
            query = query.where { nombre =~ search  }
        }

        return query.list(params)
    }
}

class PedidosPendientesFilter {

}
