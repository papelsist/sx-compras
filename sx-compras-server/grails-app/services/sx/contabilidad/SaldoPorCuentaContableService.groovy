package sx.contabilidad

import grails.gorm.transactions.Transactional

import groovy.util.logging.Slf4j
import org.springframework.transaction.annotation.Propagation

@Slf4j
class SaldoPorCuentaContableService {


    void actualizarSaldos(Integer ejercicio, Integer mes){
        List<CuentaContable> cuentasDeMayor = CuentaContable.where{padre == null}.list()
        cuentasDeMayor.each { cuenta ->
            actualizarSaldos(cuenta, ejercicio, mes)
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
                log.info('Acumular saldos en: {}', children[0])
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


}
