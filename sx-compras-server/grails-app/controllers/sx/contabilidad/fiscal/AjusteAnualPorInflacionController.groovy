package sx.contabilidad.fiscal

import grails.plugin.springsecurity.annotation.Secured

import grails.rest.*
import grails.converters.*

@Secured("ROLE_CONTABILIDAD")
class AjusteAnualPorInflacionController extends RestfulController<AjusteAnualPorInflacion> {
    
    static responseFormats = ['json']

    AjusteAnualPorInflacionBuilder ajusteAnualPorInflacionBuilder
    
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

    def generar() {
    	def ej = params.ejercicio
    	def mes = params.mes
		ajusteAnualPorInflacionBuilder.buildFrom(ej, mes)
		respond AjusteAnualPorInflacion.where{ejercicio: ej}.list()
    }

}
