package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable

import groovy.transform.CompileDynamic
import groovy.transform.ToString
import groovy.util.logging.Slf4j

import sx.core.Sucursal
import sx.reports.ReportService
import sx.utils.Periodo

@Slf4j
@GrailsCompileStatic
@Secured(['ROLE_GASTOS'])
class EnvioComisionController extends RestfulController<EnvioComision> {

    static responseFormats = ['json']

    ReportService reportService

    EnvioComisionService envioComisionService

    EnvioComisionController() {
        super(EnvioComision)
    }

    @Override
    @CompileDynamic
    protected List<EnvioComision> listAllResources(Map params) {
        params.sort = 'lastUpdated'
        params.order = 'desc'
        params.max = params.registros?: 3000
        log.info('List: {}', params)
        def query = EnvioComision.where{}

        if(params.periodo) {
            def periodo = params.periodo
            def res = EnvioComision
                    .findAll(
                    "from EnvioComision e where e.regreso between ? and ? " +
                            " order by e.nombre, e.sucursal, e.regreso," +
                            " e.documentoTipo, e.documentoFolio",
                    [periodo.fechaInicial, periodo.fechaFinal])
            return res
        }

        return query.list(params)
    }

    def generar() {
        log.info('Generar: {}', params)
        Periodo periodo = new Periodo()
        bindData(periodo, getObjectToBind())
        envioComisionService.generarComisiones(periodo.fechaInicial, periodo.fechaFinal)
        List<EnvioComision> res = envioComisionService.calcularComisiones(periodo)
        log.info('{} comisiones genradas para el periodo: {}', res.size(), periodo)
        respond res

    }

    def batchUpdate(EnvioComisionBatchUpdate command) {
        if(command == null) {
            notFound()
            return
        }
        command.validate()
        if(command.hasErrors()) {
            respond command.errors, view:'edit' // STATUS CODE 422
            return

        }
        log.info('BatchUpdate de: {}', command)
        List<EnvioComision> res = []
        command.registros.each {
            bindData(it, command)
            it.manual = true
            res << envioComisionService.calcular(it)

        }
        respond res
    }

    def entregasPorChofer() {
        Periodo periodo = (Periodo)params.periodo
        Map repParams = [
                FECHA_INI: periodo.fechaInicial,
                FECHA_FIN: periodo.fechaFinal,
                SUCURSAL: params.sucursal,
                CHOFER: params.chofer
        ]

        def pdf =  reportService.run('embarques/ComisionEntregaPorChoferADMIN.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'EntregaPorChofer.pdf')
    }

    def comisionesPorFacturista() {
        Periodo periodo = (Periodo)params.periodo
        Map repParams = [
                FECHA_INI: periodo.fechaInicial,
                FECHA_FIN: periodo.fechaFinal,
                FECHA_CORTE: params.date('fechaPago', 'dd/MM/yyyy'),
                FACTURISTA: params.facturista
        ]
        repParams.MONEDA = params.moneda

        def pdf =  reportService.run('embarques/ComisionPorFacturistaDeEmbarques.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ComisionPorFacturistaDeEmbarques.jrxml.pdf')
    }


    def analisisDeEmbarque() {
        Periodo periodo = (Periodo)params.periodo
        Sucursal sucursal = Sucursal.get(params.sucursal.toString())
        Map repParams = [
                FECHA_INI: periodo.fechaInicial,
                FECHA_FIN: periodo.fechaFinal,
                SUCURSAL: sucursal ? sucursal.nombre: '%',
                ORDEN: params.orden,  // '16' // 17,18,1
                FORMA: params.forma //'asc',


        ]
        // repParams.MONEDA = params.moneda

        def pdf =  reportService.run('embarques/AnalisisDeEmbarques.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'AnalisisDeEmbarques.jrxml.pdf')
    }

    def relacionDePagosDeFletes() {
        Periodo periodo = (Periodo)params.periodo
        Map repParams = [
                FECHA_INI: periodo.fechaInicial,
                FECHA_FIN: periodo.fechaFinal,
                FECHA_CORTE: params.getDate('fechaPago', 'dd/MM/yyyy')

        ]
        def pdf =  reportService.run('embarques/RelacionDePagosDeFletes.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'RelacionDePagosDeFlete.jrxml.pdf')
    }

    def solicitudDeFacturacionDeFletes() {
        Periodo periodo = (Periodo)params.periodo
        Map repParams = [
                FECHA_INI: periodo.fechaInicial,
                FECHA_FIN: periodo.fechaFinal,
                FECHA_INI_TIMB: params.getDate('fechaTimbradoInicial', 'dd/MM/yyyy'),
                FECHA_FIN_TIMB: params.getDate('fechaTimbradoFinal', 'dd/MM/yyyy'),
                EMAIL: params['email']

        ]
        def pdf =  reportService.run('embarques/SolicituddDeFactucionDeComisionesDeEmbarques.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'SolicitudDeFacturacionDeFletes.jrxml.pdf')
    }


}

@ToString( includeNames = true, excludes = ['registros'])
class EnvioComisionBatchUpdate  implements  Validateable{


    BigDecimal comision = 0.0
    BigDecimal precioTonelada = 0.0
    BigDecimal valorCajas = 0.0
    BigDecimal maniobra = 0.0

    String comentarioDeComision

    List<EnvioComision>  registros

    static constraints = {
        comentarioDeComision nullable: true
        precioTonelada nullable: true
    }

}
