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

    @NotTransactional
    def generarDepreciacion(Integer ejercicio) {
        def activos = ActivoFijo.where{}.list()
        def res = []
        activos.each { a ->
            generarDepreciacionUnitaria(a, ejercicio)
            a.refresh()
            res << a
        }
        return res
    }


    def generarDepreciacionUnitaria(ActivoFijo af, Integer ejercicio) {
        def moi = af.montoOriginalFiscal
        def mesAdquisicion = Periodo.obtenerMes(af.adquisicion) + 1
        def ejercicioAdquisicion = Periodo.obtenerYear(af.adquisicion)
        def corteEjericioAnterior = Periodo.getPeriodoAnual( ejercicio - 1 ).fechaFinal
        def corte = Periodo.getPeriodoAnual( ejercicio  ).fechaFinal
        log.info('Depreciacion fiscal Activo: {}', af.id)
        log.info('Adquisicion: {} ({}-{}) corte eje anterior: {}', 
            af.adquisicion, mesAdquisicion, ejercicioAdquisicion, corteEjericioAnterior)
        
        
        def depreciacionEjercicioAnterior = calcularDepreciacionAcumulada(af, corteEjericioAnterior)
        def remanenteAlInicioDelEjercicio = moi - depreciacionEjercicioAnterior
        def depreciacionAcumulada = calcularDepreciacionAcumulada(af, corte)
        def depreciacionDelEjercicio = depreciacionAcumulada - depreciacionEjercicioAnterior
        def remanente = moi - depreciacionAcumulada
        log.info('Dep ejercicio anterior: {} Remanente: {}', depreciacionEjercicioAnterior, remanenteAlInicioDelEjercicio)
        
        if( remanenteAlInicioDelEjercicio <= 0) {
            log.info('Activo sin dpereciacion fiscal para el {}', ejercicio)
            return null;
        }
        log.info('Dep ejercicio: {}  Acumulada: {} Remanente: {}', depreciacionDelEjercicio, depreciacionAcumulada, remanente)
        
        def inpcAdquisicion = Inpc.where{ejercicio == ejercicioAdquisicion && mes ==  mesAdquisicion}.find()
        if(!inpcAdquisicion) {
            throw new RuntimeException("No existe INPC de adquisicion Adquisicion para ${ejercicioAdquisicion} / ${mesDeAdquisicion}")
        }
        
        def inpcMedioUso = getInpcMitadDeUso(af.adquisicion, ejercicio)
        if(!inpcMedioUso) {
            throw new RuntimeException("Imposible localizar INPC mitad de uso para la adquisicion: ${af.adquisicion}")    
        } else {
            af.inpcPrimeraMitad = inpcMedioUso.tasa
            af.save flush: true
        }
        def factor = MonedaUtils.round( (inpcMedioUso.tasa / inpcAdquisicion.tasa), 4)
        def depreciacionFiscal = depreciacionDelEjercicio * factor
        log.info('INPC Adquisicion: {} INPC Medio uso: {} Factor: {} Dep Fiscal: {}', 
            inpcAdquisicion.tasa, inpcMedioUso.tasa, factor, depreciacionFiscal)

        def depreciacion = ActivoDepreciacionFiscal.findOrCreateWhere(activoFijo: af, ejercicio: ejercicio)
        
        depreciacion.cuenta = af.cuentaContable.clave
        depreciacion.descripcionActivo = af.descripcion
        depreciacion.descripcion = af.cuentaContable.descripcion
        depreciacion.adquisicion = af.adquisicion
        depreciacion.montoOriginal = af.montoOriginal
        depreciacion.montoOriginalFiscal = af.montoOriginalFiscal
        depreciacion.tasa = af.tasaDepreciacion
        depreciacion.inpcPrimeraMitad = inpcMedioUso.tasa
        depreciacion.inpcPrimeraMitadDesc = inpcMedioUso.toString()
        depreciacion.inpcDelMesAdquisicion = inpcAdquisicion.tasa
        depreciacion.factorDeActualizacion = factor
        depreciacion.depreciacionEjercicioAnterior = depreciacionEjercicioAnterior
        depreciacion.depreciacionDelEjercicio = depreciacionDelEjercicio
        depreciacion.depreciacionAcumulada = depreciacionAcumulada
        depreciacion.remanente = remanente
        depreciacion.depreciacionFiscal = MonedaUtils.round(depreciacionFiscal, 2)

        depreciacion.save failOnError: true, flush: true
        log.info('Deprecacion fiscal generada: {}', depreciacion)
        return depreciacion
        
    }

	def generarDepreciacionUnitariaOldDelete(ActivoFijo af, Integer ejercicio) {
        
		def mesAdquisicion = Periodo.obtenerMes(af.adquisicion) + 1
        def ejercicioAdquisicion = Periodo.obtenerYear(af.adquisicion)

        if(ejercicioAdquisicion > ejercicio)
        	return null

        def ejercicioAnterior = ejercicio - 1

        def acumuladaEjercicioAnterior = ActivoDepreciacion.findAll("""
        	select sum(depreciacion) from ActivoDepreciacion d
        	where d.activoFijo.id = ?
        	  and d.ejercicio <= ?
        	""", [af.id, ejercicioAnterior])[0]?: 0.0

        def acumuladaEjercicio = ActivoDepreciacion.findAll("""
        	select sum(depreciacion) from ActivoDepreciacion d
        	where d.activoFijo.id = ?
        	  and d.ejercicio = ?
        	""", [af.id, ejercicio])[0]?: 0.0
        if(acumuladaEjercicio <= 0.0) 
        	return null

        def acumulada = acumuladaEjercicioAnterior + acumuladaEjercicio
        def remanente = af.montoOriginalFiscal - acumulada
        if(remanente < 0) {
            log.info('Activo fiscalmente ya depreciado')
            return null
        }

        def ina = Inpc.where{ejercicio == ejercicioAdquisicion && mes ==  mesAdquisicion}.find()
        if(!ina) {
            throw new RuntimeException("No existe INPC de adquisicion Adquisicion para ${ejercicioAdquisicion} / ${mesDeAdquisicion}")
        }

        af.inpcDelMesAdquisicion = ina.tasa
        af.save flush: true
        def inpcAdquisicion = ina.tasa

        def inpcMedioUso = getInpcMitadDeUso(af.adquisicion, ejercicio)
        if(!inpcMedioUso) {
            throw new RuntimeException("Imposible localizar INPC mitad de uso para la adquisicion: ${af.adquisicion}")    
        } else {
            af.inpcPrimeraMitad = inpcMedioUso.tasa
            af.save flush: true
        }
        

        def factor = inpcMedioUso.tasa / inpcAdquisicion
        def res = acumuladaEjercicio * factor
        def depreciacion = ActivoDepreciacionFiscal.findOrCreateWhere(activoFijo: af, ejercicio: ejercicio)
        
        depreciacion.with {
            cuenta = af.cuentaContable.clave
            descripcionActivo = af.descripcion
            descripcion = af.cuentaContable.descripcion
            adquisicion = af.adquisicion
            montoOriginal = af.montoOriginal
            montoOriginalFiscal = af.montoOriginalFiscal
        	inpcPrimeraMitad = inpcMedioUso.tasa
			inpcDelMesAdquisicion = inpcAdquisicion
			factorDeActualizacion = factor
            depreciacionEjercicioAnterior = acumuladaEjercicioAnterior
            depreciacionDelEjercicio = acumuladaEjercicio
			depreciacionAcumulada = acumulada
			depreciacionFiscal = MonedaUtils.round(res, 2)
            remanente = remanente

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

    /**
    * Metodo dinamico para calcular eficiantemente la depreciacion acumulada a la fecha de
    * corte indicada.
    */
    def calcularDepreciacionAcumulada(ActivoFijo af, Date corte) {
        final BigDecimal moi = af.montoOriginalFiscal
        final tf = af.tasaDepreciacion
        final anual = MonedaUtils.round( (moi * tf), 2)
        final mensual = MonedaUtils.round( (anual / 12), 2)
        BigDecimal acumulada = 0.0
        Periodo periodo = new Periodo(af.adquisicion, corte)
        List periodos = Periodo.periodosMensuales(periodo)
        for(int i = 1; i < periodos.size(); i++) {
            def p = periodos[i]
            def e = Periodo.obtenerYear(p.fechaFinal)
            def m = Periodo.obtenerMes(p.fechaFinal) + 1
            def remanente = moi - acumulada
            if(remanente < mensual) {
                mensual = remanente
            }
            acumulada += mensual
            def saldo = moi - acumulada
            // log.info('Periodo: {} {} MOI: {} Dep: {} Acu: {} Remanente: {}', e, m, moi, mensual, acumulada, remanente)
        }
        return acumulada

    }

    def getInpcParaVenta(Date fventa) {
        Integer ej = Periodo.obtenerYear(fventa)
        Integer mj = Periodo.obtenerMes(fventa) + 1
        def medio = (mj / 2) as int
        return Inpc.where{ejercicio == ej && mes == medio}.find()
    }

    def registrarBajaFiscal(ActivoFijo af) {
        def fventa = af.baja.fecha
        def corte = af.baja.fecha
        def mesAdquisicion = Periodo.obtenerMes(af.adquisicion) + 1
        def mes = Periodo.obtenerMes(corte) + 1
        def ej = Periodo.obtenerYear(corte)
        if(mes == 1) {
            mes = 12
            ej = ej - 1
        } else {
            mes = mes - 1
        }
        def p = Periodo.getPeriodoEnUnMes(mes - 1, ej)
        corte = p.fechaFinal
        def baja = af.baja
        baja.moiFiscal = af.montoOriginalFiscal
        baja.depreciacionAcumuladaFiscal = calcularDepreciacionAcumulada(af,corte)
        baja.remanenteFiscal = baja.moiFiscal - baja.depreciacionAcumuladaFiscal
        baja.inpcMedioUso = getInpcParaVenta(fventa).tasa
        baja.inpc = Inpc.where{ejercicio == Periodo.obtenerYear(af.adquisicion) && mes == mesAdquisicion}.find().tasa
        baja.factor = baja.inpcMedioUso/ baja.inpc
        baja.costoActualizadoFiscal = baja.remanenteFiscal * baja.factor
        baja.utilidadFiscal = af.baja.importeDeVenta - baja.costoActualizadoFiscal
        log.info('Utilidad fiscal: {}', baja.utilidadFiscal)

    }
}
