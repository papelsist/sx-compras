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
    		rows = generarEjercicio(ej).sort {it.renglon}
    	}
    	rows.each { r ->
    		String prop = getMesesMap().get(ms)
    		switch(r.renglon) {
    			case 1 :
    			case 2 :
    			case 3 :
    			case 16 :
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
    				BigDecimal imp = 0.0
    				(1..6).each {
    					def r1 = rows.find{rx -> rx.renglon == it}
    					imp += r1[prop]
    				}
    				r[prop] = imp
    				break
    			case 9:
    				def r7 = rows.find{it.renglon == 7}
    				def r8 = rows.find{it.renglon == 8}
    				def imp = (r7[prop] * r8[prop]) / 100.00
    				r[prop] = MonedaUtils.round(imp, 2) 
					break
				case -1: // PTU Del Mes
					def cuMes =  12 - ms + 1
					def se = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && clave == r.clave}.find()
					def ptu = se.debe / cuMes
					r[prop] = MonedaUtils.round(ptu, 2) 
					break
				case 11: // PTU Pagada
					def rx = rows.find{it.renglon == -1}
					def acu = 0.0
					(1..ms).each {
						String p = getMesesMap().get(it)
						acu += rx[p]
					}
					def ptuMesAnterior = 0.0
					if( ms > 1) {
						def mesAnterior = ms - 1
						String propAnt = getMesesMap().get(mesAnterior)
						ptuMesAnterior = r[propAnt]
					}
					r[prop] = acu + ptuMesAnterior
    				break
    			case 13:
    				def r9 = rows.find{it.renglon == 9}
    				def r10 = rows.find{it.renglon == 10}
    				def r11 = rows.find{it.renglon == 11}
    				def r12 = rows.find{it.renglon == 12}
    				r[prop] = r9[prop] + r10[prop] - r11[prop] -r12[prop]
    				break
    			case 15:
    				def r13 = rows.find{it.renglon == 13}
    				def r14 = rows.find{it.renglon == 14}
    				def imp = (r13[prop] * r14[prop]) / 100.00
    				r[prop] = MonedaUtils.round(imp, 2) 
    				break
    			case 17 :
    				if (ms == 1) {
    					r[prop] = 0.0
    				} else {
    					def ant = ms - 1
						def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ant && clave == r.clave}.find()
    					r[prop] = saldo.saldoFinal.abs()
    				}
    				break
    			case 19:
    				def r15 = rows.find{it.renglon == 15}
    				def r16 = rows.find{it.renglon == 16}
    				def r17 = rows.find{it.renglon == 17}
    				def r18 = rows.find{it.renglon == 18}
    				def imp = r15[prop] - r16[prop] - r17[prop] - r18[prop]
    				r[prop] = MonedaUtils.round(imp, 2) 
    				break
    			case 20:
    				BigDecimal imp = 0.0
    				(15..18).each { rx ->
    					def r1 = rows.find{it.renglon == rx}
    					imp += r1[prop]
    				}
    				r[prop] = imp
    				break
    			case 21 :
    				def saldo = SaldoPorCuentaContable.where{ejercicio == ej && mes == ms && clave == r.clave}.find()
    				r[prop] = saldo.saldoFinal.abs()
    				break
    			case 22:
    				def r20 = rows.find{it.renglon == 20}
    				def r21 = rows.find{it.renglon == 21}
    				def imp = r20[prop] - r21[prop]
    				r[prop] = MonedaUtils.round(imp, 2) 
    		}
    		// logEntity(r)
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
				[ejercicio: ej, clave: '215-0001-0000-0000', concepto: 'PTU PAGADA EN EL EJERCICIO',renglon: 11],
				[ejercicio: ej, clave: 'MANUAL_03', concepto: 'PERDIDAS FISCALES DE EJERC. ANT.',renglon: 12],
				[ejercicio: ej, clave: 'FORMULA_03', concepto: 'RESULTADO FISCAL ESTIMADO',renglon: 13],
				[ejercicio: ej, clave: 'MANUAL_04', concepto: 'TASA I.S.R. VIGENTE',renglon: 14],
				[ejercicio: ej, clave: 'FORMULA_04', concepto: 'PAGO PROVISIONAL ACUMULADO',renglon: 15],
				[ejercicio: ej, clave: '750-0002-0000-0000', concepto: 'I.S.R. RETENIDO BANCARIO',renglon: 16],
				[ejercicio: ej, clave: '750-0001-0000-0000', concepto: 'IMPUESTO SOBRE LA RENTA PAGADO',renglon: 17],
				[ejercicio: ej, clave: 'MANUAL_05', concepto: 'I.S.R. ACREDITABLE POR DIVIDENDOS',renglon: 18],
				[ejercicio: ej, clave: 'FORMULA_05', concepto: 'I.S.R. A PAGAR',renglon: 19],
				[ejercicio: ej, clave: 'FORMULA_06', concepto: 'SEGÚN PAPEL DE TRABAJO',renglon: 20],
				[ejercicio: ej, clave: '750-0000-0000-0000', concepto: 'SEGÚN BALANZA',renglon: 21],
				[ejercicio: ej, clave: 'FORMULA_07', concepto: 'DIFERENCIA',renglon: 22],
				[ejercicio: ej, clave: '215-0001-0000-0000', concepto: 'PTU DEL MES',renglon: -1]
	    	]
    	List<PagoIsr> res = []
    	conceptos.each { row ->
    		PagoIsr p = new PagoIsr(row)
    		// logEntity(p)
    		p.save failOnError: true, flush: true
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
