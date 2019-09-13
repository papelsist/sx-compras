package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import sx.core.LogUser
import sx.utils.MonedaUtils
import sx.utils.Periodo


@Transactional
// @GrailsCompileStatic
@Slf4j
class ActivoDepreciacionService implements LogUser {

    List<ActivoFijo> generarDepreciacionBatch(Integer eje, Integer mes) {
        log.info('Generando depreciacion batch: {} - {}', eje, mes )
        List activos = ActivoFijo
            .findAll("""
                from ActivoFijo a 
                where a.remanente > 0 
                  and a.tasaDepreciacion > 0
                  and a.estado != 'BAJA'
                """)
        List updated = []
        
        for(item in activos) {
            // Ejercicio/mes de la adquisicion
            def mesIni = Periodo.obtenerMes(item.adquisicion) + 1
            def ejercicioIni = Periodo.obtenerYear(item.adquisicion)
            // Excluir todos los
            if (ejercicioIni == eje && mesIni <= mes) {
                continue
            }
            log.info('Dep para activo: {}', item)
            def dep = generarDepreciacionUnitaria(item, eje, mes)
            updated << dep.activoFijo
        }
        return updated
    }

    ActivoDepreciacion generarDepreciacionUnitaria(ActivoFijo af, Integer year, Integer month) {
        Date corte = Periodo.getPeriodoEnUnMes(month - 1, year).fechaFinal
        def depreciacion = ActivoDepreciacion.findOrCreateWhere(activoFijo: af, ejercicio: year, mes: month)
        depreciacion.corte = corte

        def acumulada = ActivoDepreciacion.where{activoFijo == af}.list().sum 0.0, {it.depreciacion}
        // def inicial = 0.0 af.depreciacionInicial
        af.depreciacionAcumulada = acumulada
        
        depreciacion.tasaDepreciacion = af.tasaDepreciacion
        depreciacion.depreciacionAcumulada = acumulada 
        def tf = af.tasaDepreciacion
        def anual = MonedaUtils.round( (af.montoOriginal * tf), 2)
        def mensual = MonedaUtils.round( (anual / 12), 2)
        def remanente = af.montoOriginal - acumulada
        
        if(remanente < mensual) {
            mensual = remanente
            af.estado = 'DEPRECIADO'
            af.save flush: true
        }

        depreciacion.depreciacion = mensual
        logEntity(depreciacion)
        depreciacion.save failOnError: true, flush: true
        return depreciacion
    }

    
    @NotTransactional
    def correrDepreciaciones(Date corte) {
        log.info('Regenerando depreciacioens de todos los activos hasta el: {} ', corte )
        List activos = ActivoFijo
            .findAll("""
                from ActivoFijo a 
                where a.remanente > 0 
                  and a.tasaDepreciacion > 0
                  and a.estado != 'BAJA'
                """)
            activos.each { af ->
                generarDepreciacionTotal(af, corte)
            }
    }

    @NotTransactional
    def generarDepreciacionTotal(ActivoFijo af, Date corte) {
        if(af.estado == 'VENDIDO') {
            return
        }
        log.info('AF: {} Adquisicion: {}', af.id, af.adquisicion.format('dd/MM/yyyy') )
        ActivoDepreciacion.executeUpdate("delete ActivoDepreciacion where activoFijo = ?", [af])
        af.estado = 'VIGENTE'
        Periodo periodo = new Periodo(af.adquisicion, corte)
        List periodos = Periodo.periodosMensuales(periodo)
        for(int i = 1; i < periodos.size(); i++) {
            def p = periodos[i]
            def e = Periodo.obtenerYear(p.fechaFinal)
            def m = Periodo.obtenerMes(p.fechaFinal) + 1
            log.info('Periodo: {} {}', e, m)
            generarDepreciacionUnitaria(af,e,m)
            if(af.estado == 'DEPRECIADO') {
                break;
            }

        }
        

    }

    ActivoDepreciacion update(ActivoDepreciacion depreciacion) {
        logEntity(depreciacion)
        depreciacion.save failOnError: true, flush: true
        return depreciacion

    }

   
}
