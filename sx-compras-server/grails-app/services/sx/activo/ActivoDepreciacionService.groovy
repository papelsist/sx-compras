package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.utils.MonedaUtils
import sx.utils.Periodo


@Transactional
// @GrailsCompileStatic
@Slf4j
class ActivoDepreciacionService implements LogUser {
    

    ActivoDepreciacion generarDepreciacion(ActivoDepreciacion depreciacion) {
        ActivoFijo af = depreciacion.activoFijo
        def acumulada = ActivoDepreciacion.where{activoFijo == af}.list().sum 0.0, {it.depreciacion}
        def inicial = af.depreciacionInicial
        af.depreciacionAcumulada = acumulada
        
        depreciacion.tasaDepreciacion = af.tasaDepreciacion
        depreciacion.depreciacionAcumulada = acumulada + inicial

        depreciacion.ejercicio = Periodo.obtenerYear(depreciacion.corte)
        depreciacion.mes = Periodo.obtenerMes(depreciacion.corte) + 1
        
        def tf = (af.tasaDepreciacion / 100)
        def anual = MonedaUtils.round( (af.montoOriginal * tf), 2)
        def mensual = MonedaUtils.round( (anual / 12), 2)
        def remanente = af.montoOriginal - (acumulada + inicial)
        
        if(remanente < mensual) {
            mensual = remanente
        }

        depreciacion.depreciacion = mensual
        logEntity(depreciacion)
        depreciacion.save failOnError: true, flush: true

        af.depreciacionAcumulada = af.depreciacionAcumulada + mensual
        af.save flush: true
        return depreciacion

    }

    ActivoDepreciacion update(ActivoDepreciacion depreciacion) {
        logEntity(depreciacion)
        depreciacion.save failOnError: true, flush: true
        return depreciacion

    }

   
}
