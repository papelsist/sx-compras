package sx.costos

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*

import groovy.util.logging.Slf4j
import sx.reports.ReportService
import sx.utils.Periodo

@GrailsCompileStatic
@Slf4j
@Secured("ROLE_COSTOS_MANAGER")
class CostoPromedioController extends RestfulController<CostoPromedio> {

    static responseFormats = ['json']

    CostoPromedioService costoPromedioService

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

    def calcular(Integer ejercicio, Integer mes) {
        respond costoPromedioService.calcular(ejercicio, mes)
    }

    def aplicar(Integer ejercicio, Integer mes) {
        respond costoPromedioService.aplicar(ejercicio, mes)
    }

    def generarReporte(Integer ejercicio, Integer mes) {}
}
