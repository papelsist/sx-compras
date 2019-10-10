package sx.contabilidad.fiscal

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional

import sx.activo.Inpc
import sx.utils.Mes
import sx.utils.MonedaUtils

@Slf4j
class AjusteAnualPorInflacionService {

    def sumary(Integer ej, Integer ms) {
    	def count = ms + 1
		
		def ajustes = AjusteAnualPorInflacion.where{ejercicio == ej}.list().findAll {it.concepto.concepto == 'SUMA'}
		def activos = ajustes.findAll{it.concepto.tipo == 'ACTIVO'}
		def pasivos = ajustes.findAll{it.concepto.tipo == 'PASIVO'}

		def totalActivos = 0.0
		def totalPasivos = 0.0

		def activoSumary = [:]
		def pasivoSumary = [:]

		(0..ms).each {
		    def key = Mes.findByClave(it).nombre.toLowerCase()

		    // Activos
		    def activoValue = activos.sum 0.0, {it[key]}
			activoSumary[key] = activoValue
		    totalActivos += activoValue
		    
		    // Pasivos
		    def pasivoValue = pasivos.sum 0.0, {it[key]}
		    pasivoSumary[key] = pasivoValue
		    totalPasivos += pasivoValue

		}
		activoSumary.totalActivos = totalActivos
		pasivoSumary.totalPasivos = totalPasivos

		activoSumary.meses = count
		pasivoSumary.meses = count

		def activosPromedio = totalActivos / count
		def pasivosPromedio = totalPasivos / count

		activoSumary.promedioAnualCreditos = activosPromedio
		activoSumary.promedioAnualDeudas = pasivosPromedio
		activoSumary.diferencia = (activosPromedio - pasivosPromedio) < 0.0 ? 0.0 : (activosPromedio - pasivosPromedio)

		pasivoSumary.promedioAnualDeudas = pasivosPromedio
		pasivoSumary.promedioAnualCreditos = activosPromedio
		pasivoSumary.diferencia = (pasivosPromedio - activosPromedio) < 0.0? 0.0 : (pasivosPromedio - activosPromedio)

		def inpc = Inpc.where{ejercicio == ej && mes == (ms + 1)}.find()
		def inpcAnterior = Inpc.where{ejercicio == (ej-1) && mes ==(ms + 1)}.find()
		def factor = MonedaUtils.round( (inpc.tasa / inpcAnterior.tasa), 4) - 1

		activoSumary.inpc = inpc.tasa
		activoSumary.inpcAnterior = inpcAnterior.tasa
		activoSumary.factor = factor
		activoSumary.inpcDesc = "I.N.P.C ${ej} / ${ms + 1}"
		activoSumary.ajusteAnual = MonedaUtils.round( (factor * activoSumary.diferencia), 2)

		pasivoSumary.inpc = inpc.tasa
		pasivoSumary.inpcAnterior = inpcAnterior.tasa
		pasivoSumary.factor = factor
		pasivoSumary.inpcDesc = "I.N.P.C ${ej} / ${ms + 1}"
		pasivoSumary.ajusteAnual = MonedaUtils.round( (factor * pasivoSumary.diferencia), 2)
		return ['credito': activoSumary, 'debito': pasivoSumary]
    }
}
