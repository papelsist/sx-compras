package sx.contabilidad

import grails.transaction.NotTransactional
import groovy.util.logging.Slf4j

@Slf4j
class SaldoPorCuentaContableService {

    def actualizarSaldos(Integer ejercicio, Integer mes){
        def cuentas = CuentaContable.findAllByDetalle('true')
        log.info("Actualizando saldos de cuentas contables {} - {}", ejercicio, mes )
        cuentas.each{ c ->
            log.info('Actualizano cuenta: {}', c)
            actualizarSaldoCuentaDetalle(c, ejercicio, mes)
        }
        mayorizar(ejercicio, mes)
    }

    SaldoPorCuentaContable actualizarSaldoCuentaDetalle(CuentaContable cuenta, Integer ejercicio, Integer mes){
        if(!cuenta.detalle)
            throw new RuntimeException("Cuenta acumulativa no de detalle ${cuenta}")
        log.info("Actualizando cuenta {} Ejercicio: {}/{}",cuenta.clave, ejercicio, mes )

        BigDecimal saldoInicial = 0.0

        if (mes == 1){
            SaldoPorCuentaContable cierreAnual = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cuenta, ejercicio - 1, 13)
            saldoInicial = cierreAnual?.saldoFinal?: 0.0
        }else{
            saldoInicial = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cuenta, ejercicio, mes-1 )?.saldoFinal?:0.0
        }
        log.info('Saldo inicial:{} ', saldoInicial)

        def row = PolizaDet
                .executeQuery("""
                    select sum(d.debe),sum(d.haber) 
                        from PolizaDet d 
                         where d.cuenta=? 
                         and ejercicio = ? 
                         and mes = ? 
                         and d.poliza.tipo!=?"""
                ,[cuenta, ejercicio, mes, 'CIERRE_ANUAL'])

        BigDecimal debe=row.get(0)[0]?:0.0
        BigDecimal haber=row.get(0)[1]?:0.0

        SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                .findOrCreateWhere(cuenta: cuenta, clave: cuenta.clave, ejercicio: ejercicio, mes: mes)

        saldo.saldoInicial = saldoInicial
        saldo.debe = debe
        saldo.haber = haber
        saldo.saldoFinal = saldo.saldoInicial + debe - haber
        saldo.save failOnError:true, flush: true
    }

    @NotTransactional
    void mayorizar(Integer ejercicio, Integer mes) {
        List<CuentaContable> cuentas = CuentaContable.where{padre == null}.list()
        cuentas.each {
            mayorizar(it, ejercicio, mes)
        }
    }

    @NotTransactional
    void mayorizar(CuentaContable cuenta, Integer ejercicio, Integer mes) {
        def niveles = calcularNiveles(cuenta, 1) - 1
        (niveles..1).each {
            mayorizarCuenta(cuenta, it, ejercicio, mes)
        }

    }


    def mayorizarCuenta(CuentaContable cuenta, int nivel, Integer ejercicio, Integer mes) {
        String clave = cuenta.clave
        String[] parts = clave.split('-')
        String ma = parts[0] + '%'
        List<CuentaContable> subcuentas = CuentaContable.where{clave =~ ma && nivel == nivel}.list()
        //println "----------------------- Mayorizando ${subcuentas.size()} de nivel $nivel ---------------------"
        log.info("-- Mayorizando {} de nivel {}", subcuentas.size(), nivel)
        subcuentas.each {
            // println it
            SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                    .findOrCreateWhere(cuenta: it, clave: cuenta.clave, ejercicio: ejercicio, mes: mes)
            def row = SaldoPorCuentaContable
                    .executeQuery("""
                    select sum(d.saldoInicial),
                        sum(d.debe),
                        sum(d.haber), 
                        sum(d.saldoFinal) 
                        from SaldoPorCuentaContable d 
                         where d.cuenta.padre = ? 
                         and ejercicio = ? 
                         and mes = ?
                         """
                    ,[it, ejercicio, mes])
            BigDecimal ini = row.get(0)[0]?:0.0
            BigDecimal debe = row.get(0)[1]?:0.0
            BigDecimal haber = row.get(0)[2]?:0.0
            BigDecimal fin = row.get(0)[3]?:0.0
            saldo.saldoInicial = ini
            saldo.debe = debe
            saldo.haber = haber
            saldo.saldoFinal = fin
            saldo.save failOnError: true, flush: true
            log.info("Actualizado: ",saldo)

        }


    }

    /**
     * Trasladar los saldos finales de un mes a los iniciales del mes siguiente.
     * Toma en cuenta el mes 13
     *
     *
     * @param ejercicio
     * @param mes
     */
    @NotTransactional
    void cierreMensual(Integer ejercicio, Integer mes) {

        Integer nextMes = mes + 1
        Integer nextEjercicio = ejercicio
        if(mes == 13) {
            nextEjercicio = nextEjercicio + 1
            nextMes = 1
        }
        log.info("Cierre mensual {}/{} trasladando saldos a {},{}", ejercicio, mes, nextEjercicio, nextMes)
        // Cacelamos el cierre de existir con anterioridad
        //cancelarCierreMensual(nextEjercicio, nextMes)


        List<SaldoPorCuentaContable> saldos = SaldoPorCuentaContable.where{ejercicio == ejercicio && mes == mes}.list()

        saldos.each { SaldoPorCuentaContable sl ->
            CuentaContable cta = sl.cuenta

            SaldoPorCuentaContable saldo = new SaldoPorCuentaContable(
                    cuenta: cta,
                    clave: cta.clave,
                    ejercicio: nextEjercicio,
                    mes: nextMes,
                    saldoInicial: sl.saldoFinal,
                    saldoFinal: sl.saldoFinal
            )
            saldo.save failOnError: true, flush: true

            sl.cierre = new Date()
            sl.save flush: true

        }
    }


    Integer calcularNiveles(CuentaContable cuenta, int nivel) {
         if(cuenta.subcuentas)
             return calcularNiveles(cuenta.subcuentas.first(), nivel + 1)
         return nivel
    }

    def cancelarCierreMensual(Integer ejercicio, Integer mes) {
        return SaldoPorCuentaContable
                .executeUpdate("delete SaldoPorCuentaContable s where s.ejercicio = ? and s.mes= ?", [ejercicio, mes])
    }

    def actualizarSaldos(Poliza poliza) {
        Map<String, CuentaContable> cuentas = [:]
        poliza.partidas.each {
            cuentas.put(it.cuenta.clave, it.cuenta)
        }
        cuentas.each{
            CuentaContable cuenta = it.value
            Integer ejercicio = poliza.ejercicio
            Integer mes = poliza.mes
            SaldoPorCuentaContable saldo = actualizarSaldoCuentaDetalle(cuenta, ejercicio, mes)
            log.info('Saldo {}: {}', saldo.cuenta.clave, saldo.saldoFinal)
        }
        log.info('Mayorizando...')
        cuentas.each {
            mayorizar(it.value, poliza.ejercicio, poliza.mes)
        }

    }


}
