package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.reports.ReportService
import sx.tesoreria.CuentaDeBanco
import sx.tesoreria.PagoDeRembolsoService

import static org.springframework.http.HttpStatus.NOT_FOUND

@Secured(['ROLE_GASTOS', 'ROLE_TESORERIA'])
@GrailsCompileStatic
@Slf4j
class RembolsoController extends RestfulController {

    static responseFormats = ['json']

    ReportService reportService

    RembolsoService rembolsoService

    PagoDeRembolsoService pagoDeRembolsoService

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
    private logUser(Rembolso instance) {
        if (isLoggedIn()) {
            String username = getPrincipal().username
            instance.updateUser = username
            if(!instance.createUser)
                instance.createUser = username
            instance.partidas.each {
                it.updateUser = username
                if(!it.createUser)
                    it.createUser = username
            }
        }
    }


    @CompileDynamic
    @Override
    protected Object updateResource(Object resource) {
        logUser(resource)
        resource.nombre = resource.sucursal.nombre
        resource.save flush: true
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

    def pagar(PagoDeRembolso command) {
        if(command == null) {
            respond status: NOT_FOUND
            return
        }
        if(command.hasErrors()) {
            respond(command.errors, status: 422)
            return
        }
        Rembolso rembolso = pagoDeRembolsoService.pagar(command)
        rembolso.refresh()
        log.info('Rembolso pagado: {} Egreso: {} Cheque: {}', rembolso.id, rembolso.egreso.id, rembolso.egreso.cheque ?: '')
        respond rembolso
    }

    def cancelarPago(Rembolso rembolso) {
        if(rembolso == null) {
            notFound()
            return
        }
        rembolso = pagoDeRembolsoService.cancelarPago(rembolso)
        respond rembolso
    }

    def cancelarCheque() {
        String comentario = params.comentario?: 'CANCELACION'
        Rembolso rembolso = Rembolso.get(this.params.getInt('id'))
        rembolso = pagoDeRembolsoService.cancelarCheque(rembolso, comentario)
        respond rembolso
    }

    def generarCheque(Rembolso rembolso) {
        if(rembolso == null) {
            notFound()
            return
        }
        rembolso = pagoDeRembolsoService.generarCheque(rembolso)
        respond rembolso
    }

    def print( ) {
        Map repParams = [ID: params.id]
        def pdf =  reportService.run('Reembolso.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Rembolso.pdf')
    }
}

class PagoDeRembolso implements  Validateable{
    Rembolso rembolso
    CuentaDeBanco cuenta
    String referencia
    BigDecimal importe

    String toString() {
        return "Pago de rembolso ${rembolso.id} Cuenta: ${cuenta?.clave}  Referencia ${referencia}"
    }

    static constraints =  {
        referencia nullable: true
        importe nullable: true
    }
}

class CancelacionPagoDeRembolsoCheque implements  Validateable{
    Rembolso rembolso
    String comentario

    String toString() {
        return "Cancelacion de cheque ${rembolso.folio} Comentario: ${comentario}"
    }

    static constraints =  {
        comentario nullable: true
    }
}

