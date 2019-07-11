package sx.contabilidad

import grails.gorm.transactions.Transactional

import org.apache.commons.lang3.exception.ExceptionUtils

import groovy.util.logging.Slf4j

import sx.utils.*

@Slf4j
class PagoIsrService {

	Map<Integer, String> mesesMap
    
    List<PagoIsr> generar(Integer ej, Integer ms, BigDecimal utilidadAf, BigDecimal cfUtilidad, BigDecimal perdidaFiscal, BigDecimal tasaIsr, BigDecimal isrAcreDiv) {
    	List<PagoIsr> rows = PagoIsr.where{ejercicio == ej}.list().sort{it.renglon}
    	if(!rows) {
    		rows = generarEjercicio(ej)
    	}

    	rows.each { r ->
    		String prop = getMesesMap().get(ms)
    		switch(r.renglon) {
    			case 1 :
    			case 2 :
    			case 3 :
    			case 16 :
    			case 17 :
    				def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && clave == r.clave}.find()
    				r[prop] = saldo.saldoFinal.abs()
    				break
    			case 4:
    				r[prop] = utilidadAf
    				break
    			case 8:
    				r[prop] = cfUtilidad
    				break
    			case 12:
    				r[prop] = perdidaFiscal
    				break
    			case 14:
    				r[prop] = tasaIsr
    				break
    			case 18:
    				r[prop] = isrAcreDiv
    				break
    			case 6: 
    				def se = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && clave == r.clave}.find()
    				r[prop] = se.haber - se.debe
    				break
    			case 7: 
    				log.info('Procesando renglon 7')
    				BigDecimal imp = 0.0
    				(0..5).each {
    					def r1 = rows.get(it)		
    					imp += r1[prop]
    				}
    				r[prop] = imp
    				break
    			case 9:
    				def r7 = rows.get(6)
    				def r8 = rows.get(7)
    				def imp = (r7[prop] * r8[prop]) / 100.00
    				r[prop] = MonedaUtils.round(imp, 2) 
					break	
    		}
    		r.save failOnError: true, flush: true
    	}
        return rows
    }



    List<PagoIsr> generarEjercicio(Integer ej) {

    	def conceptos = [
		    	[ejercicio: ej, clave: '401-0000-0000-0000', concepto: 'VENTAS ',renglon: 1],
				[ejercicio: ej, clave: '702-0000-0000-0000', concepto: 'PRODUCTOS FINANCIEROS',renglon: 2],
				[ejercicio: ej, clave: '704-0000-0000-0000', concepto: 'OTROS INGRESOS',renglon: 3],
				[ejercicio: ej, clave: 'MANUAL_01', concepto: 'UTILIDAD FISCAL EN VENTA DE ACTIVO FIJO',renglon: 4],
				[ejercicio: ej, clave: 'NO_EXISTE_01', concepto: 'VENTA INMUEBLE',renglon: 5],
				[ejercicio: ej, clave: '206-0000-0000-0000', concepto: 'ANTICIPOS A CLIENTES',renglon: 6],
				[ejercicio: ej, clave: 'FORMULA_01', concepto: 'INGRESOS NOMINALES',renglon: 7],
				[ejercicio: ej, clave: 'MANUAL_02', concepto: 'COEFICIENTE DE UTILIDAD',renglon: 8],
				[ejercicio: ej, clave: 'FORMULA_02', concepto: 'UTILIDAD FISCAL ESTIMADA',renglon: 9],
				[ejercicio: ej, clave: 'NO_EXISTE_02', concepto: 'INVENTARIO ACUMULABLE MENSUAL',renglon: 10],
				[ejercicio: ej, clave: '215-0001-0000-0000', concepto: 'PTU PAGADA EN EL EJERCICIO 2016',renglon: 11],
				[ejercicio: ej, clave: 'MANUAL_03', concepto: 'PERDIDAS FISCALES DE EJERC. ANT.',renglon: 12],
				[ejercicio: ej, clave: 'FORMULA_03', concepto: 'RESULTADO FISCAL ESTIMADO',renglon: 13],
				[ejercicio: ej, clave: 'MANUAL_04', concepto: 'TASA I.S.R. 2015',renglon: 14],
				[ejercicio: ej, clave: 'FORMULA_04', concepto: 'PAGO PROVISIONAL ACUMULADO',renglon: 15],
				[ejercicio: ej, clave: '750-0002-0000-0000', concepto: 'I.S.R. RETENIDO BANCARIO',renglon: 16],
				[ejercicio: ej, clave: '750-0001-0000-0000', concepto: 'IMPUESTO SOBRE LA RENTA PAGADO',renglon: 17],
				[ejercicio: ej, clave: 'MANUAL_05', concepto: 'I.S.R. ACREDITABLE POR DIVIDENDOS',renglon: 18],
				[ejercicio: ej, clave: 'FORMULA_05', concepto: 'I.S.R. A PAGAR',renglon: 19],
				[ejercicio: ej, clave: 'FORMULA_06', concepto: 'SEGÚN PAPEL DE TRABAJO',renglon: 20],
				[ejercicio: ej, clave: '750-0000-0000-0000', concepto: 'SEGÚN COI (SALDO FINAL 750-0000-000)',renglon: 21],
				[ejercicio: ej, clave: 'FORMULA_07', concepto: 'DIFERENCIA',renglon: 22]
	    	]
    	List<PagoIsr> res = []
    	conceptos.each { row ->
    		PagoIsr p = new PagoIsr(row).save failOnError: true, flush: true
    		res.add(p)
    	}
    	return res
    }



    Map<Integer,String> getMesesMap() {
    	if(mesesMap == null) {
    		mesesMap = [
    		1: 'enero', 2: 'febrero', 3: 'marzo', 4: 'abril', 5: 'mayo', 6: 'junio',
    		7: 'julio', 8: 'agosto', 9: 'septiembre', 10: 'octubre', 11: 'noviembre', 12: 'diciembre']
    	}
    	return mesesMap
    }
    
}
