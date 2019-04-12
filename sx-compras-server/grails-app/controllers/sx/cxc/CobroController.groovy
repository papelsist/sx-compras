package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Sucursal
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_TESORERIA', 'ROLE_GASTOS', 'ROLE_CONTABILIDAD'])
class CobroController extends RestfulController<Cobro> {
    static responseFormats = ['json']

    ReportService reportService
    CobroService cobroService


    CobroController() {
        super(Cobro)
    }

    @Override
    protected List<Cobro> listAllResources(Map params) {
        params.sort = params.sort ?: 'lastUpdated'
        params.order = params.order ?: 'desc'
        params.max = params.registros ?: 20
        def stipo = params.tipo ?: 'CRE'

        log.info('List: {}', params)

        def query = Cobro.where { formaDePago != 'BONIFICACION' || formaDePago != 'DEVOLUCION'}

        if(stipo != 'TODOS') {
            query = Cobro.where{ tipo == stipo}
        } else {
            query = Cobro.where{ tipo != 'CON' && tipo != 'COD'}
        }

        if(params.periodo) {
            Periodo periodo = (Periodo)params.periodo
            query = query.where {fecha >= periodo.fechaInicial && fecha <= periodo.fechaFinal}
        }

        if(params.nombre) {
            query = query.where {cliente.nombre =~ params.nombre}
        }
        // query = query.where {saldo > 1.0}
        return query.list(params)
    }

    @Override
    protected Cobro createResource() {
        Cobro cobro =  new Cobro()
        bindData cobro, getObjectToBind()
        cobro.sucursal = Sucursal.where{nombre == 'OFICINAS'}.find()
        return cobro
    }

    def aplicar(AplicarCobroCommand command) {
        if(command == null) {
            notFound()
            return
        }
        Cobro cobro = cobroService.registrarAplicaciones(command.cobro, command.facturas)
        cobro.refresh()
        forward action: 'show', id: cobro.id
        // respond cobro view: 'show'
    }

    def eliminarAplicacion(AplicacionDeCobro aplicacionDeCobro) {
        if(aplicacionDeCobro == null) {
            notFound()
            return
        }
        Cobro cobro = cobroService.eliminarAplicacion(aplicacionDeCobro)
        cobro.refresh()
        forward action: 'show', id: cobro.id
    }




    @Override
    protected Cobro saveResource(Cobro cobro) {
        return this.cobroService.save(cobro)
    }

    @Override
    protected Cobro updateResource(Cobro resource) {
        return this.cobroService.update(resource)
    }



    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }

    @CompileDynamic
    def reporteDeCobranza(CobranzaPorFechaCommand command){
        def repParams = [FECHA: command.fecha]
        repParams.ORIGEN = params.cartera
        def pdf =  reportService.run('CobranzaCxc.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'CobranzaCxc.pdf')
    }

    @CompileDynamic
    def reporteDeCobranzaCON(CobranzaPorSucursalCommand command){
        def repParams = [FECHA: command.fecha.format('yyyy/MM/dd'), SUCURSAL: command.sucursal]
        def pdf =  reportService.run('FacturasCobrada.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'CobranzaCON.pdf')
    }

    @CompileDynamic
    def reporteDeCobranzaCOD(CobranzaPorSucursalCommand command){
        def repParams = [FECHA: command.fecha.format('yyyy/MM/dd'), SUCURSAL: command.sucursal]
        def pdf =  reportService.run('CobranzaCamioneta.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'CobranzaCON.pdf')
    }



    @CompileDynamic
    def reporteDeRelacionDePagos(RelacionPagosCommand command){
        log.debug('Rep: {}', params)
        def repParams = [FECHA: command.fecha]
        repParams.ORIGEN = params.origen
        repParams.COBRADOR = command.cobrador == 0 ? '%': command.cobrador.toString()
        def pdf =  reportService.run('RelacionDePagos.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'RelacionDePagos.pdf')
    }

    @CompileDynamic
    def ajustarFormaDePago(Cobro cobro) {
        if(cobro == null) {
            notFound()
            return
        }
        String fp = params.formaDePago
        log.info('Ajustando forma de pago a: {}', fp)
        if(fp == 'EFECTIVO') {
            cobro.formaDePago = 'EFECTIVO'
        } else {
            cobro.formaDePago = 'PAGO_DIF'
        }
        cobro.aplicaciones.each {
            it.formaDePago = cobro.formaDePago
        }
        if(isLoggedIn()) {
            cobro.updateUser = getPrincipal().username
        }
        cobro.save flush: true
        respond cobro
    }
}

class CobranzaPorFechaCommand {
    Date fecha
    Date fechaFin

    static constraints = {
        fechaFin nullable: true
    }
}

class RelacionPagosCommand {
    Date fecha
    String origen
    Integer cobrador
}

class CobranzaPorSucursalCommand {
    Date fecha
    String sucursal
}

@ToString
class AplicarCobroCommand {
    Cobro cobro
    List<CuentaPorCobrar> facturas
}

