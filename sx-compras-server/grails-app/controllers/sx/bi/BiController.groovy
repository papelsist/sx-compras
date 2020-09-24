package sx.bi


import grails.databinding.BindingFormat
import grails.plugin.springsecurity.annotation.Secured
import groovy.util.logging.Slf4j
import sx.reports.ReportService
import sx.utils.Periodo


@Secured("IS_AUTHENTICATED_ANONYMOUSLY")
@Slf4j
class BiController {

    VentaNetaService ventaNetaService
    AnalisisDeVentaService analisisDeVentaService

    ReportService reportService

    def analisisDeVenta() {
        Periodo periodo = (Periodo)params.periodo
        log.info('Analisis de ventas {}', periodo)
        respond analisisDeVentaService.buildAnalisis(periodo)
    }

    def ventaNetaAcumulada(VentaAcumuladaCommand command){
        log.info('Venta acumulada: {}', command)
        def ventas = ventaNetaService.ventaNetaAcumulada(command)
        respond ventas

    }

    def ventaNetaMensual(VentaAcumuladaCommand command){
        Periodo periodo = (Periodo)params.periodo
        command.fechaInicial = periodo.fechaInicial
        command.fechaFinal = periodo.fechaFinal
        log.info('Venta neta mensual: {}', command)
        def ventas=ventaNetaService.ventaNetaMensual(command)
        respond ventas

    }

    def movimientoCosteado(VentaAcumuladaCommand  command,String id){
        Periodo periodo = (Periodo)params.periodo
        command.fechaInicial = periodo.fechaInicial
        command.fechaFinal = periodo.fechaFinal
        log.info('Movimiento costeado: {} ID: ', command, id)
        def movimientos = ventaNetaService.movimientoCosteado(command,id)
        respond movimientos

    }

    def movimientoCosteadoDet(VentaAcumuladaCommand  command,String id,String clave){
        Periodo periodo = (Periodo)params.periodo
        command.fechaInicial = periodo.fechaInicial
        command.fechaFinal = periodo.fechaFinal
        def movimientos = ventaNetaService.movimientoCosteadoDet(command,id,clave)
        respond movimientos
    }

    def bajaEnVentas() {
        log.info('Params: {} ', params)
        Periodo periodo = params.periodo
        Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
        repParams.FORMA = params.forma
        repParams.ORDER = params.orden as Integer
        repParams.DIAS = params.dias  as Integer
        repParams.VALOR_VENTA = params.valorVenta as BigDecimal
        repParams.ORIGEN = params.origen
        repParams.PORCENTAJE = params.porcentaje as Double
        repParams.SUCURSAL = params.sucursal
        def pdf =  reportService.run('BajaEnVentas.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'BajaEnVentas.pdf')
    }
    def mejoresClientes() {
        log.info('Params: {} ', params)
        Periodo periodo = params.periodo
        Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
        repParams.ORIGEN = params.origen
        repParams.NO_CLIENTES = params.numeroDeClientes  as Integer

        def pdf =  reportService.run('MejoresClientes.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'MejoresClientess.pdf')
    }

    def ventasClientesResumen() {
        log.info('Params: {} ', params)
        Periodo periodo = params.periodo
        Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
        repParams.ORIGEN = params.origen
        repParams.CLIENTE = params.cliente

        def pdf =  reportService.run('VentasClienteResumen.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'VentasClienteResumen.pdf')
    }

    def clienteSinVentas() {
        log.info('Params: {} ', params)
        Periodo periodo = params.periodo
        Map repParams = ['FECHA_INI': periodo.fechaInicial, 'FECHA_FIN': periodo.fechaFinal]
        repParams.FORMA = params.forma
        repParams.ORDER = params.orden as Integer
        repParams.DIAS = params.dias  as Integer
        repParams.VALOR_VENTA = params.valorVenta as BigDecimal
        repParams.ORIGEN = params.origen
        repParams.SUCURSAL = params.sucursal
        def pdf =  reportService.run('ClienteSinVenta.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'ClientesSinVenta.pdf')
    }

}

class VentaAcumuladaCommand{

    String clasificacion

    String tipoVenta

    String tipo

    @BindingFormat('yyyy-MM-dd')
    Date fechaInicial

    @BindingFormat('yyyy-MM-dd')
    Date fechaFinal

    String toString(){
        return "${fechaInicial} ${fechaFinal} ${clasificacion} ${tipoVenta} ${tipo}"
    }

    static constraints = {
        tipo nullable:true
    }

}
