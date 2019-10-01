package sx.cxp

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.core.Producto
import sx.utils.MonedaUtils


@Transactional
@GrailsCompileStatic
@Slf4j
class AnalisisDeTransformacionDetService implements LogUser {

    AnalisisDeTransformacionDet save(AnalisisDeTransformacionDet det) {
        log.info('Salvando Analis TRS unitario: {}', det)
    	Producto producto = det.trs.producto
    	det.clave = producto.clave
    	det.descripcion = producto.descripcion
    	det.unidad = producto.unidad
        det.kilos = producto.kilos
        actualizarCosto(det)
        logEntity(det)
        det.save failOnError: true, flush: true
        return det
    }

    def actualizarCosto(AnalisisDeTransformacionDet det) {
        def factor = det.unidad == 'MIL' ? 1000 : 1
        def kilos = (det.cantidad / factor) * det.kilos
        kilos = MonedaUtils.round(kilos, 4)
        

    }
}
