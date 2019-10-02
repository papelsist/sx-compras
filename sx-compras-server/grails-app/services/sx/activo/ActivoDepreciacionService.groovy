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
                where a.tasaDepreciacion > 0
                  and a.estado = 'VIGENTE'
                  order by a.id desc
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
            if (dep)
                updated << dep.activoFijo
        }
        return updated
    }

    ActivoDepreciacion generarDepreciacionUnitaria(ActivoFijo af, Integer year, Integer month) {

        Date corte = Periodo.getPeriodoEnUnMes(month - 1, year).fechaFinal

        def depreciacion = ActivoDepreciacion.findOrCreateWhere(activoFijo: af, ejercicio: year, mes: month)
        depreciacion.corte = corte

        def acumulada = ActivoDepreciacion.where{activoFijo == af}.list().sum 0.0, {it.depreciacion}
        // def acumulada = calcularDepreciacionAcumulada(af, corte)
        
        af.depreciacionAcumulada = acumulada
        
        depreciacion.tasaDepreciacion = af.tasaDepreciacion
        depreciacion.depreciacionAcumulada = acumulada 
        def tf = af.tasaDepreciacion
        def anual = MonedaUtils.round( (af.montoOriginal * tf), 2)
        def mensual = MonedaUtils.round( (anual / 12), 2)
        def remanente = af.montoOriginal - acumulada
        
        if(remanente < mensual) {
            mensual = remanente
            if(af.estado != 'VENDIDO')
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
                where a.tasaDepreciacion > 0
                  and a.estado = 'VIGENTE'
                  order by a.adquisicion desc
                """)
        activos.each { af ->
            generarDepreciacionTotal(af, corte)
        }
    }

    @NotTransactional
    def generarDepreciacionTotal(ActivoFijo af, Date corte) {
        
        log.info('AF: {} Adquisicion: {}', af.id, af.adquisicion.format('dd/MM/yyyy') )
        ActivoDepreciacion.executeUpdate("delete ActivoDepreciacion where activoFijo = ?", [af])
        af.estado = 'VIGENTE'
        if(af.baja && af.baja.fecha.before(corte)) {
            // Ajuste por baja
            def fbaja = af.baja.fecha
            def mesFinal = Periodo.obtenerMes(fbaja) 
            def ejercicioFinal = Periodo.obtenerYear(fbaja)
            if (mesFinal == 0) {
                ejercicioFinal = ejercicioFinal - 1
                mesFinal = 12
            }
            def periodoFinal = Periodo.getPeriodoEnUnMes(mesFinal - 1, ejercicioFinal)
            corte = periodoFinal.fechaFinal
            log.info('Detectando baja en {} Mes: {}', fbaja, mesFinal)
            af.estado = 'VENDIDO'
        }

        Periodo periodo = new Periodo(af.adquisicion, corte)
        List periodos = Periodo.periodosMensuales(periodo)
        for(int i = 1; i < periodos.size(); i++) {
            def p = periodos[i]
            def e = Periodo.obtenerYear(p.fechaFinal)
            def m = Periodo.obtenerMes(p.fechaFinal) + 1
            log.info('Periodo: {} {}', e, m)
            generarDepreciacionUnitaria(af,e,m)
            if(af.estado == 'DEPRECIADO') {
                af.depreciado = p.fechaFinal
                break;
            }
        }
    }

    /**
    * Metodo dinamico para calcular eficiantemente la depreciacion acumulada a la fecha de
    * corte indicada.
    */
    def calcularDepreciacionAcumulada(ActivoFijo af, Date corte) {
        final BigDecimal moi = af.montoOriginal
        final tf = af.tasaDepreciacion
        final anual = MonedaUtils.round( (af.montoOriginal * tf), 2)
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
            if(remanente <= 0.0) {
                def pp = Periodo.getPeriodoEnUnMes( m - 1, e)
                log.info('Depreciada {}/{} ({})', e, m, pp.fechaFinal)
                af.depreciado = pp.fechaFinal
                return acumulada
                // log.info('Periodo: {} {} MOI: {} Dep: {} Acu: {} Remanente: {}', e, m, moi, mensual, acumulada, remanente)
            }
        }
        return acumulada

    }

    ActivoDepreciacion update(ActivoDepreciacion depreciacion) {
        logEntity(depreciacion)
        depreciacion.save failOnError: true, flush: true
        return depreciacion

    }

    def registrarBajaContable(ActivoFijo af) {
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

        baja.moiContable = af.montoOriginal
        baja.depreciacionContable = calcularDepreciacionAcumulada(af, corte)
        baja.remanenteContable = baja.moiContable - baja.depreciacionContable
        baja.utilidadContable = baja.importeDeVenta - baja.remanenteContable
        log.info('MOI: {} Depreciacion: {} Remanente: {} Utilidad: {}',
            baja.moiContable,
            baja.depreciacionContable,
            baja.remanenteContable,
            baja.utilidadContable)

    }

   
}
