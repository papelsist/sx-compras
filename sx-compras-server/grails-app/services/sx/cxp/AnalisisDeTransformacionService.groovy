package sx.cxp

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.core.FolioLog
import sx.core.Proveedor
import sx.core.Producto
import sx.core.Sucursal
import sx.utils.MonedaUtils
import sx.utils.Periodo

@Transactional
// @GrailsCompileStatic
@Slf4j
class AnalisisDeTransformacionService implements LogUser, FolioLog {

    AnalisisDeTransformacion save(AnalisisDeTransformacion analisis) {
    	log.debug("Salvando analisis de TRS {}", analisis)
    	analisis.nombre = analisis.proveedor.nombre
        logEntity(analisis)
        analisis.save failOnError: true, flush: true
        return analisis
    }

    AnalisisDeTransformacion update(AnalisisDeTransformacion analisis) {
        log.info('Acualizando analisis: {} Manual: {}', analisis, analisis.manual)
    	procesarPartidas(analisis)
    	if(analisis.cxp) {
    		analisis.uuid = analisis.cxp.uuid
            if(analisis.manual) {
                actualizarCostoManual(analisis)
            } else {
                actualizarCosto(analisis)        
            }
    		
    	}
    	logEntity(analisis)
    	analisis = analisis.save failOnError: true, flush: true
    	return analisis
    }

    @CompileDynamic
    def procesarPartidas(AnalisisDeTransformacion analisis) {
    	analisis.partidas.each { det ->
            def producto = det.trs.producto
            det.clave = producto.clave
            det.descripcion = producto.descripcion
            det.unidad = producto.unidad
            actualizarKilos(det)
            if (det.cantidad > det.trs.pendienteDeAnalizar) {
                det.cantidad = det.trs.pendienteDeAnalizar
            }
            log.info('Partida: {} cantidad: {}', det.clave, det.cantidad)
    	}
    }

    @CompileDynamic
    private actualizarKilos(AnalisisDeTransformacionDet det) {
    	def producto = det.trs.producto
    	def factor = det.unidad == 'MIL' ? 1000 : 1
        def kilos = (det.cantidad / factor) * producto.kilos
        det.kilos = MonedaUtils.round(kilos, 4)
    }

    @CompileDynamic
    def actualizarCosto(AnalisisDeTransformacion analisis) {
    	def totalKilos = analisis.partidas.sum 0.0, { item -> item.kilos}
    	def subtotal = analisis.cxp.subTotal
        log.info('Total Kilos: {} SubTotal: {}', totalKilos, subtotal)

    	analisis.partidas.each { AnalisisDeTransformacionDet det ->
            def factor = det.unidad == 'MIL' ? 1000 : 1
            def cc = det.cantidad / factor
            if(cc) {
                det.participacion = det.kilos / totalKilos
                det.importe = MonedaUtils.round( subtotal * det.participacion , 2)
                det.costo = MonedaUtils.round(det.importe / cc )
                def trs = det.trs
                trs.costo = det.costo
                trs.save flush: true

                def inventario = trs.inventario
                inventario.gasto = det.costo
                inventario.save flush: true
            }
        	
    	}
        // Actualizando el importe por pagar en CxP
        def cxp = analisis.cxp
        cxp.importePorPagar = cxp.total
        cxp.save flush: true
    }

    @CompileDynamic
    def actualizarCostoManual(AnalisisDeTransformacion analisis) {
        analisis.partidas.each { AnalisisDeTransformacionDet det ->
            def factor = det.unidad == 'MIL' ? 1000 : 1
            def cc = det.cantidad / factor
            if(cc) {
                det.participacion = 0
                if(det.importe) {
                    det.costo = MonedaUtils.round(det.importe / cc )    
                    
                    def trs = det.trs
                    trs.costo = det.costo
                    trs.save flush: true

                    def inventario = trs.inventario
                    inventario.gasto = det.costo
                    inventario.save flush: true
                }
            }
            
        }
        def totalAnalizado = analisis.partidas ? analisis.partidas.sum{it.importe} : 0.0
        def totalAnalizadoIva = MonedaUtils.calcularImpuesto(totalAnalizado)
        def porPagar = totalAnalizado + totalAnalizadoIva
        // log.info('Por pagar: {}', porPagar)
        def cxp = analisis.cxp
        cxp.importePorPagar = cxp.total
        cxp.save flush: true
    }

     @CompileDynamic
     def consolidar(Periodo periodo) {
        log.info('Consolidando costos de transformaciones Per: {}', periodo)
        def analisis = AnalisisDeTransformacionDet
            .executeQuery("from AnalisisDeTransformacionDet a where a.analisis.fecha between ? and ? ", 
            [periodo.fechaInicial, periodo.fechaFinal])
        def grupos =  analisis.groupBy{it.trs.id}
        grupos.each{ key, value ->
            if(value.size() > 1 ) {
                def analisis_A = value[0]
                log.info('TRS: {}', key )
                value.each { a ->
                    log.info('Analisis {} Cantidad: {} Costo: {} Importe:{}', a.analisis.id, a.cantidad, a.costo, a.importe)
                }
                def suma = value.sum 0.0, {r -> r.importe}
                def cantidad = value.sum 0.0, {r-> r.cantidad}
                def factor = analisis_A.unidad == 'MIL' ? 1000 : 1
                def cc = cantidad / factor
                def costo = MonedaUtils.round(suma / cc )
                log.info('Importe total: {} Cantidad: {} Costo: {}', suma, cc, costo)

                def trs = analisis_A.trs
                trs.costo = costo
                trs.save flush: true

                def inventario = trs.inventario
                inventario.gasto = costo
                inventario.save flush: true

                value.each { det ->
                    def an = det.analisis
                    an.comentario = "${an.comentario} (Costo consolidado)"
                }
                
            }
            
        }
        
     }
    
}
