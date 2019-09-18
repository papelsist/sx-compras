package sx.activo

import groovy.util.logging.Slf4j


import sx.core.LogUser
import sx.utils.MonedaUtils
import sx.utils.Periodo
import sx.contabilidad.CuentaContable
import sx.contabilidad.SaldoPorCuentaContable



@Slf4j
class DepreciacionAnalisisService implements LogUser {

    def generar(Integer ejercicio, Integer mes) {
        def cuentas = ActivoFijo.findAll("select distinct(cuentaContable) from ActivoFijo")
        log.info('Generando resumen {}-{} Ctas: {}', ejercicio, mes, cuentas.size())
        def res = []
        cuentas.each { cta ->
            res.addAll(generarResumen(cta, ejercicio, mes))
        }
        return res
    }
    
    def generarResumen(CuentaContable cuenta, Integer ejercicio, Integer mes) {
        Map grupo = [:]
        grupo.cuenta = cuenta.descripcion
        grupo.descripcion = "${cuenta.descripcion}"
        grupo.importe = 0.0
        grupo.depreciacionHistorica = 0.0
        grupo.depreciacionAcumulada = 0.0
        grupo.saldoPorDeducir = 0.0
        grupo.depreciacionFiscal = 0.0
        grupo.saldoEnBalanza = 0.0
        grupo.diferencia = 0.0
        grupo.tipo = 'HEADER'

        Map iniciales = [:]

        iniciales.descripcion = 'ACTIVOS AL INICIO DEL EJERCICIO'
        iniciales.cuenta = cuenta.descripcion
        iniciales.importe = calcularActivosIniciales(cuenta, ejercicio)
        iniciales.depreciacionHistorica = calcularDepreciacionHistorica(cuenta, ejercicio, mes)
        iniciales.depreciacionAcumulada = depreciacionAcumuladaActivosAnteriores(cuenta, ejercicio, mes)
        iniciales.saldoPorDeducir = iniciales.importe - iniciales.depreciacionHistorica - iniciales.depreciacionAcumulada
        iniciales.depreciacionFiscal = depreciacionFiscalAnterior(cuenta, ejercicio)
        iniciales.saldoEnBalanza = 0.0
        iniciales.diferencia = 0.0
        iniciales.tipo = 'ROW'

        Map adquiridos = [:]
        adquiridos.descripcion = 'ACTIVOS ADQUIRIDOS'
        adquiridos.cuenta = cuenta.descripcion
        adquiridos.importe = adquisicionesDelEjercicio(cuenta, ejercicio, mes)
        adquiridos.depreciacionHistorica = 0.0
        adquiridos.depreciacionAcumulada = depreciacionAcumuladaActivosNuevos(cuenta, ejercicio, mes)
        adquiridos.saldoPorDeducir = adquiridos.importe - adquiridos.depreciacionHistorica - adquiridos.depreciacionAcumulada
        adquiridos.depreciacionFiscal = depreciacionFiscal(cuenta, ejercicio)
        adquiridos.saldoEnBalanza = 0.0
        adquiridos.diferencia = 0.0
        adquiridos.tipo = 'ROW'

        Map enajenados = [:]
        enajenados.descripcion = 'ACTIVOS ENAJENADOS'
        enajenados.cuenta = cuenta.descripcion
        enajenados.importe = 0.0
        enajenados.depreciacionHistorica = 0.0
        enajenados.depreciacionAcumulada = 0.0
        enajenados.saldoPorDeducir = 0.0
        enajenados.depreciacionFiscal = 0.0
        enajenados.saldoEnBalanza = 0.0
        enajenados.diferencia = 0.0
        enajenados.tipo = 'ROW'

        Map resumen = [:]
        resumen.descripcion = "SUMA ${cuenta.descripcion}"
        resumen.cuenta = cuenta.descripcion
        resumen.importe = iniciales.importe + adquiridos.importe + enajenados.importe
        resumen.depreciacionHistorica = iniciales.depreciacionHistorica + adquiridos.depreciacionHistorica + enajenados.depreciacionHistorica
        resumen.depreciacionAcumulada = iniciales.depreciacionAcumulada + adquiridos.depreciacionAcumulada + enajenados.depreciacionAcumulada
        resumen.saldoPorDeducir = resumen.importe - resumen.depreciacionHistorica - resumen.depreciacionAcumulada
        resumen.depreciacionFiscal = iniciales.depreciacionFiscal + adquiridos.depreciacionFiscal + enajenados.depreciacionFiscal
        resumen.saldoEnBalanza = saldoEnBalanza(cuenta, ejercicio, mes)
        resumen.diferencia = resumen.saldoPorDeducir - resumen.saldoEnBalanza 
        resumen.tipo = 'ACUMULADO'

        // Depreciacion Historica
        def res =  [grupo, iniciales, adquiridos, enajenados, resumen]
        
        return res
    }


    /**
    * Calcual los activos iniciales al inicio del periodo
    **/
    def calcularActivosIniciales(CuentaContable cuenta, Integer ejercicio) {
        def res = ActivoFijo.findAll("""
            select 
                sum(a.montoOriginal) as moi
            from ActivoFijo a 
            where a.cuentaContable= ? and year(a.adquisicion) < ?
            """, [cuenta, ejercicio])
        // log.info('Res: {}', res)
        return res[0]?: 0.0
        
    }

    def adquisicionesDelEjercicio(CuentaContable cuenta, Integer ejercicio, Integer mes) {
        def adquisiciones = ActivoFijo.findAll("""
            select sum(a.montoOriginal) as moi
            from ActivoFijo a
            where a.cuentaContable = ? and year(a.adquisicion) = ? and month(a.adquisicion) <= ?
            """, [cuenta, ejercicio, mes])[0]?: 0.0

    }

    def calcularDepreciacionHistorica(CuentaContable cuenta, Integer ejercicio, Integer mes) {
        def depreciacion = ActivoDepreciacion.findAll("""
            select sum(x.depreciacion) 
            from ActivoDepreciacion x 
            where x.activoFijo.cuentaContable = ? 
            and x.ejercicio < ?
        """, [cuenta, ejercicio])[0]?: 0.0
        return depreciacion
    }

    def depreciacionAcumuladaActivosAnteriores(CuentaContable cuenta, Integer ejercicio, Integer mes) {
        def depreciacion = ActivoDepreciacion.findAll("""
            select sum(x.depreciacion) 
            from ActivoDepreciacion x 
            where x.activoFijo.cuentaContable = :cuenta
              and year(x.activoFijo.adquisicion) < :ejercicio
              and x.ejercicio = :ejercicio
        """, [cuenta: cuenta, ejercicio: ejercicio])[0]?: 0.0
        return depreciacion
    }

    def depreciacionAcumuladaActivosNuevos(CuentaContable cuenta, Integer ejercicio, Integer mes) {
        def depreciacion = ActivoDepreciacion.findAll("""
            select sum(x.depreciacion) 
            from ActivoDepreciacion x 
            where x.activoFijo.cuentaContable = :cuenta
              and year(x.activoFijo.adquisicion) = :ejercicio
              and x.ejercicio = :ejercicio
        """, [cuenta: cuenta, ejercicio: ejercicio])[0]?: 0.0
        return depreciacion
    }

    def depreciacionFiscalAnterior(CuentaContable cuenta, Integer ejercicio) {
        def res = ActivoDepreciacionFiscal.findAll("""
            select sum(depreciacionFiscal)
            from ActivoDepreciacionFiscal f 
            where f.activoFijo.cuentaContable = :cuenta 
            and f.ejercicio = :ejercicio
            and year(f.activoFijo.adquisicion) < :ejercicio
            """, [cuenta: cuenta, ejercicio: ejercicio])[0]?: 0.0
        return res

    }

    def depreciacionFiscal(CuentaContable cuenta, Integer ejercicio) {
        def res = ActivoDepreciacionFiscal.findAll("""
            select sum(depreciacionFiscal)
            from ActivoDepreciacionFiscal f 
            where f.activoFijo.cuentaContable = :cuenta 
            and f.ejercicio = :ejercicio
            and year(f.activoFijo.adquisicion) = :ejercicio
            """, [cuenta: cuenta, ejercicio: ejercicio])[0]?: 0.0
        return res

    }

    def saldoEnBalanza(CuentaContable cuenta, Integer ej, Integer ms) {
        def target = this.saldos[cuenta.clave]
        if(!target) throw new RuntimeException("No se puede localizar el saldo en balanza  falta cuenta de MAPEO ara ${cuenta.clave} ")

        def saldo1 = SaldoPorCuentaContable.where{ cuenta.clave == cuenta.clave && ejercicio == ej && mes == ms}.find()
        if(!saldo1) throw new RuntimeException("No ha saldo en balanza de cta: ${cuenta.clave} (${ej}/${ms})")
        log.info('Saldo 1: {}: {}', cuenta.clave, saldo1.saldoFinal)
        
        def saldo2 = SaldoPorCuentaContable.where{ cuenta.clave == target && ejercicio == ej && mes == ms}.find()
        if(!saldo2) throw new RuntimeException("No ha saldo en balanza de cta: ${target} (${ej}/${ms})")
        log.info('Saldo 2: {}: {}', target, saldo2.saldoFinal)


        return saldo1.saldoFinal + saldo2.saldoFinal
    }


    Map saldos = [
    '152-0001-0000-0000': '171-0001-0001-0000', 
    '153-0001-0000-0000': '171-0002-0001-0000', 
    '154-0001-0000-0000': '171-0003-0001-0000', 
    '155-0001-0000-0000': '171-0004-0001-0000', 
    '156-0001-0000-0000': '171-0005-0001-0000', 
    '157-0001-0000-0000': '171-0006-0001-0000', 
    '170-0001-0000-0000': '171-0007-0001-0000', 
    '173-0001-0000-0000': '183-0001-0001-0000', 
    '181-0001-0000-0000': '183-0002-0001-0000'
    ];

}
