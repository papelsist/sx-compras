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
    }

    SaldoPorCuentaContable actualizarSaldoCuentaDetalle(CuentaContable cuenta, Integer ejercicio, Integer mes){
        if(!cuenta.detalle)
            throw new RuntimeException("Cuenta acumulativa no de detalle {}", cuenta)
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


    def calcularNiveles(CuentaContable cuenta, int nivel) {
         if(cuenta.subcuentas)
             return calcularNiveles(cuenta.subcuentas.first(), nivel + 1)
         return nivel
    }


    def cierreAnual(def periodoContable){
        def fecha = periodoContable.toPeriodo().fechaFinal
        def ejercicio = periodoContable.ejercicio

        def cuentas=CuentaContable.findAllByDetalle('false')
        log.info 'Generando cierre para : '+ejercicio
        cuentas.each{ c->
            c.subCuentas.each{
                //log.info ("Generando cierre para $c.clave $ejercicio ${fecha}")
                cierre(fecha,ejercicio,it)
            }
            cierre(fecha,ejercicio,c)

        }
    }

    def cierre(Date fecha,int year, def cuenta){

        log.info 'Cerrando cuenta'+cuenta+' Per:'+year
        if(cuenta.detalle){


            def saldoInicial=SaldoPorCuentaContable.findByCuentaAndYearAndMes(cuenta,year,12)
            assert saldoInicial ,'No existe el saldo inicial para la cuenta: '+cuenta+' año: '+year+ ' mes '+12

            def debe=0.0
            def haber=0.0

            def saldo=SaldoPorCuentaContable.findOrCreateWhere([cuenta:cuenta,year:year,mes:13])
            saldo.fecha=fecha
            saldo.cierre=fecha
            saldo.saldoInicial=saldoInicial.saldoFinal

            saldo.debe=debe
            saldo.haber=haber
            saldo.saldoFinal=saldo.saldoInicial+debe-haber
            def res=saldo.save(failOnError:true)
            log.info "Regisrando saldo de cuenta de detalle ${saldo.cuenta.clave} id:${saldo.id}"
        }else{

            def saldoInicial=SaldoPorCuentaContable.findByCuentaAndYearAndMes(cuenta,year,12)
            assert saldoInicial ,'No existe el saldo inicial para la cuenta: '+cuenta+' año: '+year+ ' mes '+12

            def debe=0.0
            def haber=0.0
            def saldo=SaldoPorCuentaContable.findOrCreateWhere([cuenta:cuenta,year:year,mes:13])

            saldo.fecha=fecha
            saldo.cierre=fecha

            saldo.saldoInicial=saldoInicial.saldoFinal
            saldo.debe=debe
            saldo.haber=haber
            saldo.saldoFinal=saldo.saldoInicial+debe-haber
            saldo.save(failOnError:true)
        }

    }

    def actualizarCierreAnual(int year){
        log.info 'Actualizando cierre anual Year: '+year
        def saldos=SaldoPorCuentaContable.findAllByYearAndMes(year,13)
        for(SaldoPorCuentaContable saldo:saldos){
            def cuenta =saldo.cuenta
            actualizarCierreAnual(year,cuenta)
        }
    }

    def actualizarCierreAnual(int year,def cuenta){

        def mes=13

        if(cuenta.detalle){


            def row=PolizaDet
                    .executeQuery("select sum(d.debe),sum(d.haber) from PolizaDet d where d.cuenta=? and year(d.poliza.fecha)=?  and d.poliza.tipo=?"
                    ,[cuenta,year,'CIERRE_ANUAL'])


            def debe=row.get(0)[0]?:0.0
            def haber=row.get(0)[1]?:0.0
            def saldo=SaldoPorCuentaContable.findOrCreateWhere([cuenta:cuenta,year:year,mes:mes])
            saldo.debe=debe
            saldo.haber=haber
            saldo.saldoFinal=saldo.saldoInicial+debe-haber
            def res=saldo.save(failOnError:true)
            log.info " Cuenta: $cuenta.clave debe:$debe  haber:$haber"
        }else{

            def row=PolizaDet.executeQuery(
                    "select sum(d.debe),sum(d.haber) from PolizaDet d where d.cuenta.padre=? and year(d.poliza.fecha)=? and d.poliza.tipo=?"
                    ,[cuenta,year,'CIERRE_ANUAL'])

            def debe=row.get(0)[0]?:0.0
            def haber=row.get(0)[1]?:0.0
            log.info " Cuenta: $cuenta.clave debe:$debe  haber:$haber"
            def saldo=SaldoPorCuentaContable.findOrCreateWhere([cuenta:cuenta,year:year,mes:mes])
            saldo.debe=debe
            saldo.haber=haber
            saldo.saldoFinal=saldo.saldoInicial+debe-haber
            saldo.save(failOnError:true)
        }

    }

    def eliminarCierreAnual(int ejercicio){
        SaldoPorCuentaContable.executeUpdate("delete from SaldoPorCuentaContable where year=? and mes=?",[ejercicio,13])

    }

    Date getInicioDeMes(Date fecha) {
        fecha.putAt(Calendar.DATE,1)
        return fecha.clearTime()
    }


}
