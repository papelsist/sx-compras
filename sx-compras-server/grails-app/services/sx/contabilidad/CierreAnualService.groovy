package sx.contabilidad

import groovy.util.logging.Slf4j

@Slf4j
class CierreAnualService implements ProcesadorDePoliza{


    Poliza generarPolizaDeCierreAnual(Integer ejercicio) {
        Poliza poliza = Poliza.where{
            tipo == 'DIARIO' && subtipo == 'CIERRE_ANUAL' &&
                    ejercicio == ejercicio && mes == 13}.find()
        if(!poliza) {
            poliza = new Poliza(
                    fecha: Date.parse('dd/MM/yyyy','31/12/2017'),
                    tipo: 'DIARIO',
                    subtipo: 'CIERRE_ANUAL',
                    concepto: 'CIERRE ANUAL ' + ejercicio,
                    ejercicio: ejercicio,
                    mes: 13,
                    folio: 1
            )
        }
        poliza.partidas.clear()
        generarPartidasDeCierreAnual(poliza)
        poliza.debe = poliza.partidas.sum (0.0,{it.debe})
        poliza.haber = poliza.partidas.sum(0.0,{it.haber})
        poliza.save failOnError: true, flush: true

    }

    void generarPartidasDeCierreAnual(Poliza poliza){

        log.info("Generando partidas de poliza de cierre")
        def asiento="CIERRE ANUAL ${poliza.ejercicio}"

        List<SaldoPorCuentaContable> saldos = SaldoPorCuentaContable
                .findAll("""
                    from SaldoPorCuentaContable s 
                     where s.ejercicio = ? 
                       and s.mes = 13 
                       and s.cuenta.deResultado = true 
                       and s.cuenta.detalle = true
                """
                ,[poliza.ejercicio])
        BigDecimal cargos = 0.0
        BigDecimal abonos = 0.0
        saldos.each { saldo->
            BigDecimal importe = saldo.saldoInicial
            if(importe > 0.0){
                poliza.addToPartidas(
                        cuenta: saldo.cuenta,
                        concepto: saldo.cuenta.descripcion,
                        debe: 0.0,
                        haber: importe,
                        asiento: asiento,
                        descripcion: asiento,
                        referencia: "",
                        fecha: poliza.fecha,
                        tipo: poliza.tipo,
                        entidad: 'SaldoPorCuetaContable',
                        sucursal: 'OFICINAS',
                        origen: saldo.id)
                abonos += importe
            } else if(importe < 0.0){
                poliza.addToPartidas(
                        cuenta:saldo.cuenta,
                        concepto: saldo.cuenta.descripcion,
                        debe: importe.abs(),
                        haber: 0.0,
                        asiento: asiento,
                        descripcion: asiento,
                        referencia: "",
                        fecha: poliza.fecha,
                        tipo: poliza.tipo,
                        entidad: 'SaldoPorCuetaContable',
                        sucursal: 'OFICINAS',
                        origen: saldo.id)

                cargos += importe.abs()
            }
        }
        BigDecimal resultado = cargos - abonos
        String clave = "304-${poliza.ejercicio.toString()}-0000-0000"
        CuentaContable cuenta = buscarCuenta(clave)
        if(resultado){
            poliza.addToPartidas(
                    cuenta: cuenta,
                    concepto: cuenta.descripcion,
                    debe: 0.0,
                    haber: resultado,
                    asiento: asiento,
                    descripcion: asiento,
                    referencia: "",
                    fecha: poliza.fecha,
                    tipo: poliza.tipo,
                    entidad: 'SaldoPorCuetaContable',
                    sucursal: 'OFICINAS',
                    origen: cuenta.id)
        }else{
            poliza.addToPartidas(
                    cuenta: cuenta,
                    concepto: cuenta.descripcion,
                    debe:resultado.abs(),
                    haber:0.0,
                    asiento:asiento,
                    descripcion:asiento,
                    referencia:"",
                    fecha:poliza.fecha,
                    tipo:poliza.tipo,
                    entidad:'SaldoPorCuetaContable',
                    sucursal: 'OFICINAS',
                    origen:cuenta.id)
        }

    }




}
