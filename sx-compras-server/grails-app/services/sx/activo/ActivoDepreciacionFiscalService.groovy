package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional

import sx.core.LogUser
import sx.utils.MonedaUtils
import sx.utils.Periodo


@Transactional
@Slf4j
class ActivoDepreciacionFiscalService implements LogUser{


	def generarDepreciacionUnitaria(ActivoFijo af, Integer ejercicio) {
		def mesAdquisicion = Periodo.obtenerMes(af.adquisicion) + 1
        def ejercicioAdquisicion = Periodo.obtenerYear(af.adquisicion)
        if(ejercicioAdquisicion > ejercicio)
        	return null

        def ejercicioAnterior = ejercicio - 1

        def acumuladaEjercicioAnterior = ActivoDepreciacion.findAll("""
        	select sum(depreciacion) from ActivoDepreciacion d
        	where d.activoFijo.id = ?
        	  and year(d.corte) <= ?
        	""", [af.id, ejercicioAnterior])[0]?: 0.0

        def acumuladaEjercicio = ActivoDepreciacion.findAll("""
        	select sum(depreciacion) from ActivoDepreciacion d
        	where d.activoFijo.id = ?
        	  and year(d.corte) = ?
        	""", [af.id, ejercicio])[0]?: 0.0
        if(acumuladaEjercicio <= 0.0) 
        	return null

        def acumulada = acumuladaEjercicioAnterior + acumuladaEjercicio

        def inpcAdquisicion = af.inpcDelMesAdquisicion
        
        if(!inpcAdquisicion)
        	throw new RuntimeException("Activo fijo  ID: ${id} sin INPC de adquisicion ", af.id)

        def inpcMedioUso = getInpcMitadDeUso(af.adquisicion, ejercicio)
        if(!inpcMedioUso) 
        	throw new RuntimeException("Imposible localizar INPC mitad de uso para la adquisicion: ${af.adquisicion}")

        def factor = inpcMedioUso.tasa / inpcAdquisicion
        def res = acumulada * factor
        def depreciacion = ActivoDepreciacionFiscal.findOrCreateWhere(activoFijo: af, ejercicio: ejercicio)
        depreciacion.with {
        	inpcPrimeraMitad = inpcMedioUso.tasa
			inpcDelMesAdquisicion = inpcAdquisicion
			factorDeActualizacion = factor
			depreciacionAcumulada = acumulada
			depreciacionFiscal = MonedaUtils.round(res, 2)
        }
        depreciacion.save failOnError: true, flush: true
        log.info('Deprecacion fiscal generada: {}', depreciacion)
        return depreciacion
	}

    def getInpcMitadDeUso(Date adquisicion, Integer ej) {
    	Integer adqEjercicio = Periodo.obtenerYear(adquisicion)
    	if(adqEjercicio < ej) {
    		return Inpc.where{ejercicio == ej && mes == 6}.find()
    	} 
    	def mesDeAdquisicion = Periodo.obtenerMes(adquisicion) + 1
    	def toMesFinal = 12 - mesDeAdquisicion + 1 // Mes incluyente
    	def mitad = toMesFinal/2 as int
    	def mesMedioUso = (mesDeAdquisicion + mitad)
    	
    	log.info(
    		" Adquisicion: {} Mes adquisicion: {} # de meses para fin de ejercicio: {} " +
    		" Mes de medio uso: {}", 
    		adquisicion.format('MMM/yyyy'), mesDeAdquisicion, toMesFinal, mesMedioUso)
    	return Inpc.where{ejercicio == ej && mes == mesMedioUso}.find()

    }

    def actualizarInpcMedioUso() {
		ActivoFijo.list().each { af ->
			Integer adqEjercicio = Periodo.obtenerYear(af.adquisicion)
			def inpc= getInpcMitadDeUso(af.adquisicion, adqEjercicio)
			if(inpc) {
				af.inpcPrimeraMitad = inpc.tasa
				af.save flush: true
			} else {
				log.info("No Existe el INPC para {}", af.adquisicion)
			}
		}
	}

	def actualizarInpcDeAdquisicion() {
		ActivoFijo.list().each { af ->
			Integer ej = Periodo.obtenerYear(af.adquisicion)
			Integer mm = Periodo.obtenerMes(af.adquisicion) + 1
			def inpc = Inpc.where{ejercicio == ej && mes == mm}.find()
			if(inpc) {
				af.inpcDelMesAdquisicion = inpc.tasa
				af.save flush: true
			}
		}
	}
}
