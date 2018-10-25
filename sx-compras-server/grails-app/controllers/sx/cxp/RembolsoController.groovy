package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.reports.ReportService

@Secured(['ROLE_GASTOS', 'ROLE_TESORERIA'])
@GrailsCompileStatic
@Slf4j
class RembolsoController extends RestfulController {

    static responseFormats = ['json']

    ReportService reportService

    RembolsoService rembolsoService

    RembolsoController() {
        super(Rembolso)
    }

    @CompileDynamic
    @Override
    protected List listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros?: 10
        log.info('List: {}', params)
        def query = Rembolso.where{}

        if(params.periodo) {
            def periodo = params.periodo
            query = query.where{fecha >= periodo.fechaInicial && fecha<= periodo.fechaFinal}
        }
        if(params.sucursal) {
            query = query.where {sucursal.id == params.sucursal}
        }
        return query.list(params)
    }

    @CompileDynamic
    @Override
    protected Object createResource() {
        Rembolso instance = new Rembolso()
        bindData instance, getObjectToBind()
        instance.nombre = instance.sucursal.nombre // Empresa.first().nombre
        if (isLoggedIn()) {
            String username = getPrincipal().username
            instance.createUser = username
            instance.updateUser = username
            instance.partidas.each {
                it.updateUser = username
                it.createUser = username
            }
        }
        return instance
    }

    @CompileDynamic
    @Override
    protected Object updateResource(Object resource) {
        if (isLoggedIn()) {
            String username = getPrincipal().username
            instance.updateUser = username
            instance.partidas.each {
                it.updateUser = username
            }
        }
        instance.nombre = instance.sucursal.nombre
        return instance
    }

    @Override
    protected void deleteResource(Object resource) {
        super.deleteResource(resource)
    }

    @CompileDynamic
    def pendientes() {
        log.info('Pendientes: {}', params)
        params.max = 30

        def q = CuentaPorPagar.where {tipo == 'GASTOS' && pagos <= 0}

        if(params.nombre) {
            def s = "${params.nombre}%"
            log.info('Term {}', s)
            q = q.where {nombre =~ s}
        }

        if(params.folio) {
            def folio = params.folio
            log.info('Utilizando folio {}', params.folio)
            q = q.where { folio == folio}
        }
        q = q.where {
            def em1 = CuentaPorPagar
            notExists RembolsoDet.where {
                def s1 = RembolsoDet
                def em2 = cxp
                return em2.id == em1.id
            }.id()
        }
        respond q.list(params)
    }

    def print( ) {
        Map repParams = [ID: params.id]
        def pdf =  reportService.run('Rembolso.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Rembolso.pdf')
    }
}
