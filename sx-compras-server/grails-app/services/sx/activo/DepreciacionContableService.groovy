package sx.activo

import groovy.util.logging.Slf4j

import grails.gorm.transactions.Transactional
import grails.gorm.transactions.NotTransactional
import grails.compiler.GrailsCompileStatic

import groovy.transform.CompileDynamic

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.LogUser
import sx.utils.MonedaUtils
import sx.utils.Periodo


// @Transactional
// @GrailsCompileStatic
@Slf4j
class DepreciacionContableService implements LogUser {


    /*
    def generarDepreciacion(Date corte) {
        def activos = ActivoFijo.findAll(
            """select a.id 
            from ActivoFijo a 
             where a.remanente > 0 
             order by a.adquisicion
             """)
        activos.each {id ->
            try {
                generarDepreciacion(id, corte)
            } catch( Exception ex) {
                log.error("Error procesando depreciacion de AcfivoFijo Id:{} Erro: {}", 
                    id, ExceptionUtils.getRootCause(ex))
            }
        }
    }
    */



    @Transactional        
    def generarDepreciacionHistorica(Long id, Date corte) {
        
        def af = ActivoFijo.get(id)
        ActivoDepreciacion.executeUpdate("delete ActivoDepreciacion where activoFijo = ?", [af])
        

        log.info('AF: {} Adquisicion: {} MOI: ${}', af.id, af.adquisicion.format('dd/MM/yyyy'), af.montoOriginal )

        def fechaInicial = af.adquisicion
        def fechaFinal = corte
        
        if(af.baja && af.baja.fecha.before(corte)) {
            fechaFinal = af.baja.fecha
        }

        Periodo periodo = new Periodo(fechaInicial, corte)
        List periodos = Periodo.periodosMensuales(periodo)

        def tf = af.tasaDepreciacion
        if(tf <= 0.0) {
            return null
        }
        def moi = af.montoOriginal
        def anual = MonedaUtils.round( ( moi * tf), 2)
        def mensual = MonedaUtils.round( (anual / 12), 2)
        def acumulada = 0.0
        def saldo = af.montoOriginal - acumulada
        
        for(int i = 1; i < periodos.size(); i++) {
            def p = periodos[i]
            def e = Periodo.obtenerYear(p.fechaFinal)
            def m = Periodo.obtenerMes(p.fechaFinal) + 1
            def importe = mensual
            if(saldo < mensual) {
                importe = saldo
            }
            
            saldo = moi - acumulada - importe

            def dep = new ActivoDepreciacion(
                activoFijo: af,
                ejercicio: e,
                mes: m,
                corte: p.fechaFinal,
                tasaDepreciacion:af.tasaDepreciacion,
                depreciacionAcumulada: acumulada, 
                depreciacion: importe,
                remanente: saldo)
            logEntity(dep)
            dep.save failOnError: true, flush: true

            acumulada += mensual
            // saldo = moi - acumulada
            
            if(saldo <= 0.0) {
                def last = periodos[(i-1)]
                log.info('DEPRECIADO EN: {}', last)
                af.depreciado = last.fechaFinal
                logEntity(af)
                break
            }
        }
    }

    def generarDepreciacion(Integer ejercicio, Integer mes) {
        def activos = ActivoFijo.findAll(
            """select a.id 
            from ActivoFijo a 
             where a.remanente > 0 
             order by a.adquisicion
             """)
        activos.each {id ->
            generarDepreciacionMensual(id, ejercicio, mes)
        }
    }

    @Transactional
    def generarDepreciacionMensual(Long id, Integer ej, Integer ms) {
        
        def af = ActivoFijo.get(id)
        def periodo = Periodo.getPeriodoEnUnMes(ms - 1, ej)
        def corte = periodo.fechaFinal
        
        if(af.baja) {
            if( Periodo.isSameMonth(af.baja.fecha, corte) )
                return
        }

        def tf = af.tasaDepreciacion
        def moi = af.montoOriginal
        def anual = MonedaUtils.round( ( moi * tf), 2)
        def mensual = MonedaUtils.round( (anual / 12), 2)

        def acumulada = af.depreciacionAcumulada
        def saldo = af.remanente
        def importe = mensual
        
        if(saldo < mensual) {
            importe = saldo
        }
        acumulada += importe

        def dep = ActivoDepreciacion
            .findOrCreateWhere(activoFijo: af, ejercicio: ej, mes: ms)
        dep.corte = periodo.fechaFinal
        dep.tasaDepreciacion = af.tasaDepreciacion
        dep.depreciacionAcumulada = acumulada
        dep.depreciacion = importe
        dep.remanente = (moi - acumulada)
        logEntity(dep)
        dep.save failOnError: true, flush: true
        
        

        if(acumulada >= moi) {
            log.info('DEPRECIADO EN: {}/{}',ej, ms )
            af.depreciado = periodo.fechaFinal
            logEntity(af)
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
