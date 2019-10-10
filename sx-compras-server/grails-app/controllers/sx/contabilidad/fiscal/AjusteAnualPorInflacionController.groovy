package sx.contabilidad.fiscal

import grails.plugin.springsecurity.annotation.Secured

import grails.rest.*
import grails.converters.*

@Secured("ROLE_CONTABILIDAD")
class AjusteAnualPorInflacionController extends RestfulController<AjusteAnualPorInflacion> {
    
    static responseFormats = ['json']

    AjusteAnualPorInflacionBuilder ajusteAnualPorInflacionBuilder

    AjusteAnualPorInflacionService ajusteAnualPorInflacionService
    
    AjusteAnualPorInflacionController() {
        super(AjusteAnualPorInflacion)
    }

    @Override
    protected List<AjusteAnualPorInflacion> listAllResources(Map params) {
        log.info('List {}', params)
        def ejercicio = params.ejercicio
        def query = AjusteAnualPorInflacion.where{}
        return  query.list()
    }

    def sumary(Integer ejercicio, Integer mes) {
        def ms = mes - 1
        log.info('Sumary: {} - {}', ejercicio, ms)
        respond ajusteAnualPorInflacionService.sumary(ejercicio, ms)
    }

    def generar(Integer ejercicio, Integer mes) {
		ajusteAnualPorInflacionBuilder.buildFrom(ejercicio, mes)
		respond AjusteAnualPorInflacion.where{ejercicio: ejercicio}.list()
    }

}
