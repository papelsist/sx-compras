package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.core.GrailsApplication
import grails.gorm.DetachedCriteria
import grails.gorm.transactions.Transactional
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.transaction.NotTransactional
import grails.web.databinding.WebDataBinding
import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Sucursal
import sx.reports.ReportService
import sx.utils.Periodo

import static org.springframework.http.HttpStatus.NO_CONTENT
import static org.springframework.http.HttpStatus.OK
import org.hibernate.FetchMode as FM

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_CONTABILIDAD")
class PolizaController extends RestfulController<Poliza> {

    static responseFormats = ['json']

    PolizaService polizaService

    ReportService reportService

    GrailsApplication grailsApplication

    PolizaDeEgresoService polizaDeEgresoService

    SaldoPorCuentaContableService saldoPorCuentaContableService

    PolizaController() {
        super(Poliza)
    }

    @Secured("permitAll")
    @CompileDynamic
    def show() {
        // log.info("Show: {}", params)
        respond Poliza.findById(params.getLong('id'), [fetch:[partidas:"join"]])
    }

    @Override
    protected List<Poliza> listAllResources(Map params) {
        params.sort = params.sort ?:'lastUpdated'
        params.order = params.order ?:'desc'
        params.max = 500
        params.ejercicio = params.ejercicio?: Periodo.currentYear()
        params.mes = params.mes?: Periodo.currentMes()
        log.debug('List : {}', params)

        def criteria = new DetachedCriteria(Poliza).build {
            eq('ejercicio', this.params.getInt('ejercicio'))
            eq('mes', this.params.getInt('mes'))
            eq('tipo', params.tipo)
            eq('subtipo', params.subtipo)
        }
        return criteria.list(params)
    }


    def save(PolizaCreateCommand command) {
        if(command == null) {
            notFound()
            return
        }
        Poliza poliza = new Poliza()
        poliza.properties = command

        String pname = polizaService.resolverProcesador(poliza)
        log.info("Generando poliza(s) con procesador: {}", pname)
        ProcesadorDePoliza procesador = (ProcesadorDePoliza)grailsApplication.mainContext.getBean(pname)
        poliza.concepto = procesador.definirConcepto(poliza)
        if(poliza.subtipo == 'CIERRE_MENSUAL'  ) {
            poliza.manual = true
        }
        poliza = polizaService.salvarPolza(poliza)
        respond poliza

    }

    @CompileDynamic
    def generarPolizas(){
        PolizaCreateCommand command = new PolizaCreateCommand()
        command.properties = getObjectToBind()
        String pname = polizaService.resolverProcesador(command.subtipo)
        ProcesadorMultipleDePolizas procesador = (ProcesadorMultipleDePolizas)grailsApplication.mainContext.getBean(pname)
        List<Poliza> res = procesador.generarPolizas(command)
        List<Poliza> polizas = []
        res.each {
            polizas << polizaService.salvarPolza(it)

        }
        respond polizas
    }

    @CompileDynamic
    def generarPolizasEgreso(){
        PolizaCreateCommand command = new PolizaCreateCommand()
        command.properties = getObjectToBind()
        log.info('Generando polizas de egreso para {}', command)
        List<Poliza> polizas = polizaDeEgresoService
                .generarPolizas(command.subtipo, command.ejercicio, command.mes, command.fecha)
        respond polizas
    }


    @Override
    @NotTransactional
    @CompileDynamic
    def update() {
        Poliza poliza = Poliza.get(params.id)
        if (poliza == null) {
            notFound()
            return
        }
        poliza.properties = getObjectToBind()
        poliza = polizaService.updatePoliza(poliza)
        respond poliza, [status: OK, view:'show']

    }

    @Transactional
    @CompileDynamic
    def copiar() {
        Poliza poliza = Poliza.get(params.id)
        if (poliza == null) {
            notFound()
            return
        }

        Poliza target = new Poliza()
        target.tipo = poliza.tipo
        target.subtipo = poliza.subtipo
        target.manual = poliza.manual
        target.concepto = poliza.concepto

        target.fecha = Periodo.finDeMes(poliza.fecha) + 1
        target.ejercicio = poliza.ejercicio
        target.mes = poliza.mes + 1

        if(poliza.mes == 12) {
            target.mes = 1
            target.ejercicio = poliza.ejercicio + 1
        }



        poliza.partidas.each { source ->
            PolizaDet det = new PolizaDet()
            det.properties = source.properties
            det.poliza = null
            target.addToPartidas(det)
        }
        target.debe =  target.partidas.sum 0.0, {it.debe}
        target.haber = target.partidas.sum 0.0, {it.haber}
        target = polizaService.salvarPolza(target)

        respond target
    }

    @CompileDynamic
    def cerrar() {
        Poliza poliza = Poliza.get(params.id)
        if (poliza == null) {
            notFound()
            return
        }
        if(poliza.cuadre > 0.0) {
            throw new RuntimeException("La póliza ${poliza.subtipo} : ${poliza.folio} no esta cuadrada, no se puede cerrar")
        }
        poliza.cierre = new Date()
        poliza = poliza.save flush: true
        // saldoPorCuentaContableService.actualizarSaldos(poliza)
        respond poliza, [status: OK, view:'show']

    }

    @CompileDynamic
    def recalcular(Poliza poliza) {
        if(poliza == null){
            notFound()
            return
        }
        if(poliza.manual) {
            throw new RuntimeException("Poliza ${poliza.id} es MANUAL no se puede recaluclar de manera automatica")
        }

        ProcesadorDePoliza procesador = getProcesador(poliza)
        poliza = procesador.recalcular(poliza)
        poliza = polizaService.updatePoliza(poliza)
        respond poliza, [ view:'show']
    }

    @CompileDynamic
    def generarFolios(String subtipo, Integer ejercicio, Integer mes) {
        List<Poliza> polizas = polizaService.refoliar(subtipo, ejercicio, mes)
        respond polizas, [ view: 'index']

    }

    @CompileDynamic
    def actualizarContadorFolios(String subtipo, Integer ejercicio, Integer mes) {
        print(" Actualizando ${subtipo} - ${ejercicio}- ${mes}")
        polizaService.actualizarContadorFolios(subtipo, ejercicio, mes)
        respond([response: "Success"], status: 200)

    }

    @CompileDynamic
    def prorratearPartida() {
        Poliza poliza = Poliza.get(params.id)
        if (poliza == null) {
            notFound()
            return
        }
        ProrratearCommand command = new ProrratearCommand()
        command.properties = getObjectToBind()

        log.info('Prorratear poliza {} con: {}', poliza.id, command)

        if(command.polizaDetId && command.data) {
            PolizaDet found = poliza.partidas.find {it.id == command.polizaDetId}
            int index = poliza.partidas.findIndexOf {it.id == command.polizaDetId}
            if(found){
                command.data.each {
                    if(it.value) {
                        Map map = it.value

                        Sucursal sucursal = Sucursal.where{clave == map.key.toString()}.find()
                        PolizaDet det = new PolizaDet()
                        det.properties = found.properties
                        det.poliza = null
                        det.poliza = poliza
                        if(sucursal) {
                            CuentaContable nvaCta = resolverCuentaPorSucursal(found.cuenta, sucursal)
                            if(nvaCta) {
                                det.cuenta = nvaCta
                            }
                            det.sucursal = sucursal.nombre
                        }
                        det.debe = found.debe ? map.value : 0.0
                        det.haber = found.haber ? map.value : 0.0

                        poliza.partidas.add(index, det)
                        index = index + 1
                    }
                }
                poliza.removeFromPartidas(found)
                poliza = polizaService.updatePoliza(poliza)
            }
        }

        respond poliza, [view: 'show']
    }

    private CuentaContable resolverCuentaPorSucursal(CuentaContable cta, Sucursal sucursal) {
        String clave = cta.clave
        String[] parts = clave.split('-')
        String suc = sucursal.clave.padLeft(4, '0')
        String nvaClave = "${parts[0]}-${parts[1]}-${suc}-${parts[3]}"
        CuentaContable cuentaContable = CuentaContable.where{clave == nvaClave}.find()
        log.info('Source: {} Suc: {}: Res: {}', cta.clave, sucursal.clave, nvaClave)
        return cuentaContable
    }

    def generarComplementos(Poliza poliza) {
        if(poliza == null) {
            notFound()
            return
        }

        poliza = getProcesador(poliza).generarComplementos(poliza)
        poliza = polizaService.salvarPolza(poliza)
        respond poliza, [view: 'show']
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
         e.printStackTrace()
        log.error(message)
        respond([message: message], status: 500)
    }

    def print( ) {
        Map repParams = [ID: params.getLong('id')]
        // repParams.ORDEN = ''
        def pdf =  reportService.run('contabilidad/Poliza.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Poliza.pdf')
    }

    def printComprobantes() {
        def tipo = params.tipo
        def name = 'PolizaComprobanteNacional.jrxml'
        if(tipo == 'E')
            name = 'PolizaComprobanteExtranjero.jrxml'
        else if (tipo == 'P')
            name = 'PolizaComplementoMetodoPago.jrxml'
        Map repParams = [ POLIZA_ID: params.getLong('id')]
        def pdf =  reportService.run("contabilidad/${name}", repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'PolizaComprobanteNacional.pdf')
    }

    ProcesadorDePoliza getProcesador(Poliza poliza) {
        String pname = polizaService.resolverProcesador(poliza)
        ProcesadorDePoliza procesador = (ProcesadorDePoliza)grailsApplication.mainContext.getBean(pname)
        return procesador
    }


}

@ToString
class PolizaCreateCommand implements  WebDataBinding {

    Integer ejercicio
    Integer mes
    String tipo
    String subtipo
    String concepto
    Integer folio
    Date fecha

    static constraints = {
        importFrom Poliza
        concepto nullable: true
    }

}

@ToString
class ProrratearCommand implements WebDataBinding {
    Long polizaDetId
    Map data
}