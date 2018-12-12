package sx.contabilidad

import groovy.util.logging.Slf4j

@Slf4j
class CierreAnualService {


    Poliza generarPolizaDeCierre(Integer ejercicio) {
        Poliza poliza = new Poliza(
                fecha: Date.parse('dd/MM/yyyy','31/12/2017'),
                tipo: 'DIARIO',
                subtipo: 'CIERRE_ANUAL',
                concepto: 'CIERRE ANUAL ' + ejercicio,
                ejercicio: ejercicio,
                mes: 13,
                folio: 1
        )
        poliza.save failOnError: true, flush: true

    }



    def cierreAnual(Integer ejercicio){
        def cuentas = CuentaContable.where{padre == null}.list()
        cuentas.each{ c->
            c.subCuentas.each{
                //log.info ("Generando cierre para $c.clave $ejercicio ${fecha}")
                cierre(fecha,ejercicio,it)
            }
            cierre(fecha,ejercicio,c)

        }
    }

    def cierre(CuentaContable cuenta, Integer ejercicio){

        if(cuenta.detalle){
            def saldoInicial = SaldoPorCuentaContable.findByCuentaAndEjercicioAndMes(cuenta, ejercicio, 12)
            if(!saldoInicial)
                throw new RuntimeException("No existe saldo inicial para ${cuenta.clave} ${ejercicio} / 12 ")

            BigDecimal debe=0.0
            BigDecimal haber=0.0
            SaldoPorCuentaContable saldo=SaldoPorCuentaContable
                    .findOrCreateWhere(cuenta:cuenta, ejercicio:ejercicio, mes:13)
            saldo.cierre = new Date()
            saldo.saldoInicial = saldoInicial.saldoFinal
            saldo.debe=debe
            saldo.haber=haber
            saldo.saldoFinal=saldo.saldoInicial + debe - haber
            saldo.save failOnError: true, flush: true
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

        def mes = 13

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

    void eliminarCierreAnual(Integer ejercicio){
        SaldoPorCuentaContable.executeUpdate("delete from SaldoPorCuentaContable where ejercicio = ? and mes = ?",
                [ejercicio, 13])
    }



}
