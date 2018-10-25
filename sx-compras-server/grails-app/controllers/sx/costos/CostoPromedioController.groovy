package sx.costos

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.util.logging.Slf4j
import sx.core.Proveedor
import sx.core.Sucursal
import sx.reports.ReportService
import sx.utils.Periodo

@GrailsCompileStatic
@Slf4j
@Secured("ROLE_COSTOS_MANAGER")
class CostoPromedioController extends RestfulController<CostoPromedio> {

    static responseFormats = ['json']

    CostoPromedioService costoPromedioService

    MovimientosCosteadosService movimientosCosteadosService

    ReportService reportService

    CostoPromedioController() {
        super(CostoPromedio)
    }

    @Override
    @Secured("ROLE_USER")
    protected List<CostoPromedio> listAllResources(Map params) {
        Integer ejercicio = this.params.getInt('ejercicio')?: Periodo.currentYear()
        Integer mes = this.params.getInt('mes')?: Periodo.currentMes()
        return CostoPromedio.where {ejercicio == ejercicio && mes == mes}.list(params)
    }

    @Secured("ROLE_USER")
    def costos(Integer ejercicio, Integer mes) {
        respond CostoPromedio.where{ejercicio == ejercicio && mes == mes}.list([sort: 'producto.linea'])
    }

    def calcular(Integer ejercicio, Integer mes) {

        def found = CostoPromedio.where{ejercicio == ejercicio && mes == mes}.count()
        if(!found) {
            costoPromedioService.generar(ejercicio, mes)
        }
        costoPromedioService.costearExistenciaInicial(ejercicio, mes)
        costoPromedioService.costearTransformaciones(ejercicio, mes)
        respond costoPromedioService.calcular(ejercicio, mes)
    }

    def aplicar(Integer ejercicio, Integer mes) {
        costoPromedioService.costearExistenciaFinal(ejercicio, mes)
        costoPromedioService.costearMovimientosDeInventario(ejercicio, mes)
        respond status: 200
    }

    def calculoDeCostoPromedio(Integer ejercicio, Integer mes) {
        Map repParams = [:]
        repParams.EJERCICIO = ejercicio.toLong()
        repParams.MES = mes.toLong()
        repParams.ARTICULOS = params.producto
        def pdf =  reportService.run('CalculoDeCostoPromedio.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'CalculoDeCostoPromedio.pdf')
    }

    @Secured("ROLE_USER")
    def movimientos(Integer ejercicio, Integer mes) {
        respond movimientosCosteadosService.movimientos(ejercicio, mes)
    }

    def inventarioCosteado(Integer ejercicio, Integer mes) {
        Map repParams = [:]
        repParams.EJERCICIO = ejercicio.toLong()
        repParams.MES = mes.toLong()
        repParams.SUC = params.sucursal
        def pdf =  reportService.run('InventarioCosteado.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'InventarioCosteado.pdf')
    }

    def movimientosCosteados(Integer ejercicio, Integer mes) {
        Map repParams = [:]
        repParams.EJERCICIO = ejercicio.toLong()
        repParams.MES = mes.toLong()
        repParams.ARTICULOS = params.producto ?: '%'
        def pdf =  reportService.run('MovimientosCosteados.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'MovimientosCosteados.pdf')
    }

    def mercanciaEnTransito() {
        Map repParams = [:]
        Periodo periodo  = (Periodo)params.periodo
        repParams.FECHA_INI = periodo.fechaInicial
        repParams.FECHA_FIN = periodo.fechaFinal
        def pdf =  reportService.run('MercanciaEnTransito.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'MercanciaEnTransito.pdf')
    }

    def facturasAnalizadas() {
        Map repParams = [:]
        Periodo periodo  = (Periodo)params.periodo
        repParams.FECHA_INI = periodo.fechaInicial
        repParams.FECHA_FIN = periodo.fechaFinal

        Proveedor proveedor = Proveedor.get(params.proveedor.toString())
        repParams.PROVEEDOR = proveedor.clave

        def pdf =  reportService.run('FacturasAnalizadasPorProveedor.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'FacturasAnalizadasPorProveedor.pdf')
    }

    def movimientosCosteadosDeDocumentos(MovimientosCosteadosCommand command) {

        Map repParams = [:]


        repParams.FECHA_INICIAL = command.fechaIni
        repParams.FECHA_FINAL = command.fechaFin
        repParams.TIPO = command.tipo
        repParams.GRUPO = command.grupo
        repParams.SUCURSAL = command.sucursal.id

        def pdf =  reportService.run('MovimientosCosteadosDeDocumentos.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'MovimientosCosteadosDeDocumentos.pdf')
    }

    def movimientosCosteadosDet(MovimientosCosteadosDetCommand command) {

        Map repParams = [:]

        repParams.FECHA = command.fecha
        repParams.DOCTO = command.documento
        repParams.TIPO = command.tipo
        repParams.SUCURSAL = command.sucursal.id

        def pdf =  reportService.run('MovimientosCosteadosDetalle.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'MovimientosCosteadosDetalle.pdf')
    }


}

class MovimientosCosteadosCommand implements  Validateable {

    Date fechaIni
    Date fechaFin
    String tipo
    String grupo
    Sucursal sucursal

    String toString() {
        return " ${tipo} ${sucursal.nombre}  ${grupo} "
    }

}

class MovimientosCosteadosDetCommand implements  Validateable {

    Date fecha
    String tipo
    String documento
    Sucursal sucursal

    String toString() {
        return " ${tipo} ${sucursal.nombre}  ${documento} "
    }

}
