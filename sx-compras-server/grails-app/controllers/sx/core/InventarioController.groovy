package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import groovy.util.logging.Slf4j
import sx.reports.ReportService

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
}
