package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.utils.MonedaUtils
import sx.utils.Periodo


@Slf4j
@GrailsCompileStatic
class VentaDeActivoService implements LogUser {

	ActivoDepreciacionFiscalService activoDepreciacionFiscalService

	ActivoFijo registrarBajaFiscal(ActivoFijo af) {
		
		BajaDeActivo baja = af.baja
		BigDecimal moi = af.montoOriginalFiscal
		BigDecimal acu = getDepreciacionAcumulada(af, baja)
		BigDecimal acuAnterior = getDepreciacionEjercicioAnterior(af, baja)
		BigDecimal acuEjercicio = acu - acuAnterior

		BigDecimal inpc = getInpcAdquisicion(af)
		BigDecimal inpcMedioUso = getInpcParaVenta(baja)
		BigDecimal factor = MonedaUtils.round( (inpcMedioUso / inpc) , 4)
		baja.inpc = inpc
		baja.inpcMedioUso = inpcMedioUso
		baja.factor = factor

		baja.moiFiscal = moi
    	baja.depreciacionFiscalAcunulada = acu
    	baja.depreciacionFiscalEjercicioAnterior = acuAnterior
    	baja.depreciacionFiscalEjercicio = acuEjercicio
    	baja.depreciacionFiscalEjercicioActualizada = MonedaUtils.round( (acuEjercicio * factor))
    	baja.costoFiscal =  moi - acu
    	baja.costoFiscalActualizado = MonedaUtils.round( (baja.costoFiscal * factor))

    	baja.utilidadFiscal = baja.importeDeVenta - baja.costoFiscalActualizado

		return af
	}

	BigDecimal getDepreciacionAcumulada(ActivoFijo af, BajaDeActivo baja) {
        def mes = Periodo.obtenerMes(baja.fecha) + 1
        def ej = Periodo.obtenerYear(baja.fecha)
        if(mes == 1) {
            mes = 12
            ej = ej - 1
        } else {
            mes = mes - 1
        }
        def corte = Periodo.getPeriodoEnUnMes(mes - 1, ej).fechaFinal
        return getDepreciacionAcumulada(af, corte)
    }

	BigDecimal getDepreciacionEjercicioAnterior(ActivoFijo af, BajaDeActivo baja) {
        def ejercicioAnterior = Periodo.obtenerYear(baja.fecha) - 1
        def corte = Periodo.getPeriodoAnual(ejercicioAnterior).fechaFinal
        return getDepreciacionAcumulada(af, corte)
    }


	BigDecimal getInpcParaVenta(BajaDeActivo baja) {
		Date fventa = baja.fecha
        Integer ej = Periodo.obtenerYear(fventa)
        Integer mj = Periodo.obtenerMes(fventa) + 1
        def medio = (mj / 2) as int
        return Inpc.where{ejercicio == ej && mes == medio}.find().tasa
    }

    BigDecimal getInpcAdquisicion(ActivoFijo af) {
    	def m = Periodo.obtenerMes(af.adquisicion) + 1
    	def e = Periodo.obtenerYear(af.adquisicion)
    	return Inpc.where{ejercicio == e && mes == m}.find().tasa
    }

    BigDecimal getDepreciacionAcumulada(ActivoFijo af, Date corte) {
    	return activoDepreciacionFiscalService.calcularDepreciacionAcumulada(af, corte)
    }


    private void prepararBaja(ActivoFijo af) {
    	BajaDeActivo baja = af.baja
    	baja.moiFiscal = af.montoOriginalFiscal
    	logEntity(af)
    	logEntity(baja)
    }
     
}
