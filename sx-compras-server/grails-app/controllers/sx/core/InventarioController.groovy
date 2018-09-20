package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.reports.ReportService

import sx.utils.Periodo

@GrailsCompileStatic
@Slf4j
@Secured("ROLE_USER")
class InventarioController extends RestfulController<Inventario>{

    static responseFormats = ['json']

    ReportService reportService

    InventarioController() {
        super(Inventario);
    }

    def movimientos(String producto, Integer ejercicio, Integer mes) {
        respond Inventario.findAll(
                "from Inventario i where i.producto.clave = ? and year(i.fecha) = ? and month(i.fecha) = ?",
                [producto, ejercicio, mes])
    }

    @CompileDynamic
    def kardex(KardexCommand command){
        command.validate()
        if (command.hasErrors()) {
            respond command.errors, view:'create' // STATUS CODE 422
            return
        }
        def c = Inventario.createCriteria()
        Periodo periodo = (Periodo)params.periodo
        def res = c {
            eq('producto', command.producto)
            between('fecha', periodo.fechaInicial, periodo.fechaFinal)
            order('dateCreated', "asc")
        }
        respond res
    }

    def printKardex(KardexCommand command) {
        def repParams = [:]
        Periodo periodo = (Periodo)params.periodo
        repParams['FECHA_INI'] = periodo.fechaInicial
        repParams['FECHA_FIN'] = periodo.fechaFinal
        repParams['PRODUCTO'] = command.producto.id
        repParams['SUCURSAL'] = command.sucursal.id
        def pdf =  reportService.run('KardexSuc.jrxml', repParams)
        render (file: pdf.toByteArray(), contentType: 'application/pdf', filename: 'Pedido.pdf')
    }
}

class KardexCommand {

    Producto producto
    Sucursal sucursal
    Date fechaInicial
    Date fechaFinal

    String toString() {
        return "${sucursal?.nombre} ${producto?.clave}  del ${fechaInicial?.format('dd/MM/yyyy')} al ${fechaFinal?.format('dd/MM/yyyy')}"
    }
}
