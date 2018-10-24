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

    ReportService reportService

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
        Map repParams = [:]
        def pdf =  reportService.run('BajaEnVentas.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'BajaEnVentas.pdf')
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