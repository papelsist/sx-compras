package sx.contabilidad

import grails.gorm.transactions.Transactional

import groovy.util.logging.Slf4j
import org.springframework.transaction.annotation.Propagation
import sx.core.LogUser

@Slf4j
class SaldoPorCuentaContableService implements LogUser{


    void actualizarSaldos(Integer ejercicio, Integer mes){
        List<CuentaContable> cuentasDeMayor = CuentaContable.where{padre == null}.list()
        cuentasDeMayor.each { cuenta ->
            // actualizarSaldos(cuenta, ejercicio, mes)
            actualizarSaldo(cuenta, ejercicio, mes)
        }
    }


    void actualizarSaldos(CuentaContable cuenta, Integer ejercicio, Integer mes){
        Node node = buildTree(cuenta, null)
        acumularActualizandoSaldos(node, ejercicio, mes)
    }


    Node buildTree(CuentaContable cuenta, Node parent) {
        if(!parent) {
            parent = new Node(null, cuenta.clave, cuenta)
        }
        cuenta.subcuentas.each { cta ->
            Node child = new Node(parent, cta.clave, cta)
            if(cta.subcuentas) {
                return buildTree(cta, child)
            }
        }
        return parent
    }


    void acumularActualizandoSaldos(Node node, Integer ejercicio, Integer mes) {
        node.breadthFirst().reverse().each { Node n ->
            List children = n.children()
            if(children.size() == 1){
                log.info('Actualizar saldos de cuenta detalle {} ({} - {})', n.value(), ejercicio, mes)
                CuentaContable cuenta = (CuentaContable)n.value()
                actualizarSaldoCuentaDetalle(cuenta, ejercicio, mes)
            } else {
                CuentaContable cuenta = (CuentaContable)children[0]
                log.info('Acumular saldos en cta acumulativa: {}', children[0])
                actualizarSaldoCuentaAcumulativa(cuenta, ejercicio, mes)

            }
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    SaldoPorCuentaContable actualizarSaldoCuentaDetalle(CuentaContable cuenta, Integer ejercicio, Integer mes){

        BigDecimal saldoInicial = 0.0

        if (mes == 1){
            SaldoPorCuentaContable cierreAnual = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cuenta, ejercicio - 1, 13)
            saldoInicial = cierreAnual?.saldoFinal?: 0.0
        }else{
            saldoInicial = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cuenta, ejercicio, mes-1)?.saldoFinal?:0.0
        }



        def row = PolizaDet
                .executeQuery("""
                    select sum(d.debe),sum(d.haber) 
                        from PolizaDet d 
                         where d.cuenta = ?
                         and d.poliza.cierre is not null
                         and ejercicio = ? 
                         and mes = ? 
                         and d.poliza.tipo!=?"""
                ,[cuenta, ejercicio, mes, 'CIERRE_ANUAL'])

        BigDecimal debe=row.get(0)[0]?:0.0
        BigDecimal haber=row.get(0)[1]?:0.0

        log.info('Movimientos de {} / {} Debe: {}  Haber: {}', ejercicio, mes, debe, haber)


        SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                .findOrCreateWhere(cuenta: cuenta, clave: cuenta.clave, ejercicio: ejercicio, mes: mes)
        saldo.nivel = cuenta.nivel
        saldo.detalle = cuenta.detalle

        saldo.saldoInicial = saldoInicial
        saldo.debe = debe
        saldo.haber = haber
        saldo.saldoFinal = saldo.saldoInicial + debe - haber
        saldo.save failOnError:true, flush: true
    }


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    SaldoPorCuentaContable actualizarSaldoCuentaAcumulativa(CuentaContable cuenta, Integer ejercicio, Integer mes) {

        SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                .findOrCreateWhere(cuenta: cuenta, clave: cuenta.clave, ejercicio: ejercicio, mes: mes)
        saldo.nivel = cuenta.nivel
        saldo.detalle = cuenta.detalle

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
                ,[cuenta, ejercicio, mes])
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
        return saldo

    }

    /**
     * Trasladar los saldos finales de un mes a los iniciales del mes siguiente.
     * Toma en cuenta el mes 13
     *
     *
     * @param ejercicio
     * @param mes
     */
    void cierreMensual(Integer ejercicio, Integer mes) {

        Integer nextMes = mes + 1
        Integer nextEjercicio = ejercicio
        if(mes == 13) {
            nextEjercicio = nextEjercicio + 1
            nextMes = 1
        }
        log.info("Cierre mensual {}/{} trasladando saldos a {},{}", ejercicio, mes, nextEjercicio, nextMes)

        List<SaldoPorCuentaContable> saldos = SaldoPorCuentaContable
                .where{ejercicio == ejercicio && mes == mes}.list()
        log.info("Registros por trasladar: {}", saldos.size())

        saldos.each {  sl ->
            CuentaContable cta = sl.cuenta

            SaldoPorCuentaContable saldo = new SaldoPorCuentaContable(
                    cuenta: cta,
                    clave: cta.clave,
                    ejercicio: nextEjercicio,
                    mes: nextMes,
                    saldoInicial: sl.saldoFinal,
                    saldoFinal: sl.saldoFinal
            )
            saldo.nivel = cta.nivel
            saldo.detalle = cta.detalle
            saldo.save failOnError: true, flush: true

            sl.cierre = new Date()
            sl.save failOnError: true, flush: true
            log.info("Saldo trasladado Cta: {} Saldo final: {}", saldo.clave, saldo.saldoFinal)
        }

    }

    def cancelarCierreMensual(Integer ejercicio, Integer mes) {
        return SaldoPorCuentaContable
                .executeUpdate("delete SaldoPorCuentaContable s where s.ejercicio = ? and s.mes= ?", [ejercicio, mes])
    }

    def actualizarSaldos(Poliza poliza) {
        // Pendiente de actualizar con el nuevo algoritmo de mayorizacion

        Map<String, CuentaContable> cuentas = [:]
        poliza.partidas.each {
            CuentaContable mayor = findRoot(it.cuenta)
            cuentas.put(mayor.clave, mayor)
        }
        log.info('Ctas de mayor a cerrar: {}', cuentas.keySet().join(','))

        cuentas.each{
            CuentaContable cuenta = it.value
            Integer ejercicio = poliza.ejercicio
            Integer mes = poliza.mes
            actualizarSaldos(cuenta, ejercicio, mes)
        }

    }

    def findRoot(CuentaContable cuenta) {
        if(cuenta.padre)
            return findRoot(cuenta.padre)
        else
            return cuenta
    }


    def actualizarSaldo(CuentaContable cta, Integer ejercicio, Integer mes) {
        if(cta.padre) {
            log.info('No se requiere el root :{}', cta.clave)
            return actualizarSaldo(cta.padre, ejercicio, mes)
        }
        log.info('Bingo: {}', cta.clave)

        List<Map> movimientos = getMovimientosAgrupados(cta, ejercicio, mes)
        // log.info("Movs: {}", movimientos)
        SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                .findOrCreateWhere(cuenta: cta, clave: cta.clave, ejercicio: ejercicio, mes: mes)
        saldo.nivel = cta.nivel
        saldo.detalle = cta.detalle

        BigDecimal saldoInicial = 0.0

        if (mes == 1){
            SaldoPorCuentaContable cierreAnual = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cta, ejercicio - 1, 13)
            saldoInicial = cierreAnual?.saldoFinal?: 0.0
        }else{
            saldoInicial = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cta, ejercicio, mes-1)?.saldoFinal?:0.0
        }
        saldo.saldoInicial = saldoInicial
        saldo.debe = movimientos.sum 0.0, {it.debe}
        saldo.haber = movimientos.sum 0.0, {it.haber}
        saldo.saldoFinal = saldo.saldoInicial + saldo.debe - saldo.haber
        saldo.save failOnError: true, flush: true
        log.info("{} I:{} D:{} H:{} F:{}", cta.clave, saldo.saldoInicial, saldo.debe, saldo.haber, saldo.saldoFinal)
        cta.subcuentas.each { CuentaContable c2 ->
            // Nivel 2
            String sclave = c2.clave.substring(0, 8)
            List<Map> movs2 = movimientos.findAll{ it.cuenta.startsWith(sclave) }.sort{it.clave}
            SaldoPorCuentaContable saldo2 = findSaldo(c2, ejercicio, mes)

            saldo2.debe = movs2.sum 0.0, {it.debe}
            saldo2.haber = movs2.sum 0.0, {it.haber}
            saldo2.saldoFinal = saldo2.saldoInicial + saldo2.debe - saldo2.haber
            saldo2.save failOnError: true, flush: true
            log.info("  {} I:{} D:{} H:{} F:{}", sclave, saldo2.saldoInicial, saldo2.debe, saldo2.haber, saldo2.saldoFinal)

            c2.subcuentas.each { CuentaContable c3 ->
                // Nivel 3
                sclave = c3.clave.substring(0, 13)
                List<Map> movs3 = movimientos.findAll{ it.cuenta.startsWith(sclave) }.sort{it.clave}
                SaldoPorCuentaContable saldo3 = findSaldo(c3, ejercicio, mes)

                saldo3.debe = movs3.sum 0.0, {it.debe}
                saldo3.haber = movs3.sum 0.0, {it.haber}
                saldo3.saldoFinal = saldo3.saldoInicial + saldo3.debe - saldo3.haber
                saldo3.save failOnError: true, flush: true
                log.info("    {} I:{} D:{} H:{} F:{}", sclave, saldo3.saldoInicial, saldo3.debe, saldo3.haber, saldo3.saldoFinal)

                c3.subcuentas.each { CuentaContable c4 ->
                    // Nivel 4
                    sclave = c4.clave
                    List<Map> movs4 = movimientos.findAll{ it.cuenta == sclave }.sort{it.clave}
                    SaldoPorCuentaContable saldo4 = findSaldo(c4, ejercicio, mes)

                    saldo4.debe = movs4.sum 0.0, {it.debe}
                    saldo4.haber = movs4.sum 0.0, {it.haber}
                    saldo4.saldoFinal = saldo4.saldoInicial + saldo4.debe - saldo4.haber
                    log.info("    {} I:{} D:{} H:{} F:{}", sclave, saldo4.saldoInicial, saldo4.debe, saldo4.haber, saldo4.saldoFinal)
                    saldo4.save failOnError: true, flush: true
                }

            }
        }
        logEntity(saldo)
        return saldo

    }

    def getMovimientosAgrupados(CuentaContable cta, Integer ej, Integer m) {
        def sclave = cta.clave.substring(0,3)
        log.info("SClave: {}", sclave)
        List<Map> rows = PolizaDet
                .executeQuery("""
                    select d.cuenta.clave, sum(d.debe),sum(d.haber) 
                        from PolizaDet d 
                         where d.cuenta.clave like ?
                         and ejercicio = ? 
                         and mes = ? 
                         and d.poliza.tipo != ?
                         and d.poliza.cierre is not null
                         group by d.cuenta.clave
                         """
                ,["${sclave}%", ej, m, 'CIERRE_ANUAL'])
        def res = rows.collect {
            [cuenta: it[0], debe: it[1], haber:it[2]]
        }
        return res
    }

    private SaldoPorCuentaContable findSaldo(CuentaContable cta, Integer ejercicio, Integer mes) {
        SaldoPorCuentaContable saldo = SaldoPorCuentaContable
                .findOrCreateWhere(cuenta: cta, clave: cta.clave, ejercicio: ejercicio, mes: mes)
        saldo.nivel = cta.nivel
        saldo.detalle = cta.detalle
        BigDecimal saldoInicial = 0.0
        if (mes == 1){
            SaldoPorCuentaContable cierreAnual = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cta, ejercicio - 1, 13)
            saldoInicial = cierreAnual?.saldoFinal?: 0.0
        }else{
            saldoInicial = SaldoPorCuentaContable
                    .findByCuentaAndEjercicioAndMes(cta, ejercicio, mes-1)?.saldoFinal?:0.0
        }
        saldo.saldoInicial = saldoInicial
        return saldo
    }



}
