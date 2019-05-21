package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.LogUser
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_TESORERIA', 'ROLE_CONTABILIDAD'])
class CorteDeTarjetaAplicacionController extends RestfulController<CorteDeTarjetaAplicacion> implements LogUser{
    static responseFormats = ['json']
    CorteDeTarjetaAplicacionController() {
        super(CorteDeTarjetaAplicacion)
    }

    @Override
    protected CorteDeTarjetaAplicacion updateResource(CorteDeTarjetaAplicacion resource) {
        resource.ingreso.importe = resource.importe.abs() * -1
        resource.ingreso.save flush: true
        logEntity(resource.corte)
        resource.corte.save flush:true
        return super.updateResource(resource)
    }

    @Override
    @CompileDynamic
    protected List<CorteDeTarjetaAplicacion> listAllResources(Map params) {
        // params.sort = params.sort ?: 'lastUpdated'
        // params.order = params.order ?: 'desc'
        // log.info('List: {}', params)
        params.max = params.registros ?: 2000

        def query = CorteDeTarjetaAplicacion.where { }
        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {corte.corte >= periodo.fechaInicial && corte.corte <= periodo.fechaFinal}
        }

        return query.list(params)
    }
}
