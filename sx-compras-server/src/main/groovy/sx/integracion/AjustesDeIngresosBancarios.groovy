package sx.integracion

import groovy.util.logging.Slf4j
import sx.cxc.ChequeDevuelto
import sx.cxc.Cobro
import sx.cxc.CobroDeposito
import sx.cxc.CobroTransferencia
import sx.tesoreria.CorteDeTarjetaAplicacion
import sx.tesoreria.MovimientoDeCuenta
import sx.tesoreria.MovimientoDeCuentaService
import sx.tesoreria.TipoDeAplicacion

@Slf4j
class AjustesDeIngresosBancarios {

    MovimientoDeCuentaService movimientoDecuentaService


    def ajustarDepositosBancarios(Date f1, Date f2) {
        List<CobroDeposito> depositos = CobroDeposito.findAll(
                "from CobroDeposito c where date(c.cobro.primeraAplicacion) between ? and ?",
                [f1, f2])
        log.info('Depositos a procesar {}', depositos.size())
        depositos.each {
            def ingreso = it.ingreso
            if(!ingreso) {
                println "Falta ingreso del cobro-deposito Tipo: ${it.cobro.tipo} ${it.cobro.id} "
                log.info("Falta ingreso del cobro.deposito")
                if(!it.cobro.tipo) {
                    println '-----Cobro sin tipo: ' + it.cobro.id
                    if(it.cobro.aplicaciones){
                        def ap = it.cobro.aplicaciones.first()
                        it.cobro.tipo = ap.cuentaPorCobrar.tipo
                        it = it.cobro.save flush: true
                    } else
                        println '------Sin aplicaciones tambien-------'

                }
                if(it.cobro.tipo){
                    ingreso = service.generarIngresoPorDepositoBancario(it)
                    if(ingreso)
                        println "Ingreso generado ${ingreso.id}"
                    else
                        println "No se pudo genera ingreso para el cobro: ${it.cobro.id}"
                }
            } else {
                if(['CRE','JUR','CHE'].contains(it.cobro.tipo))
                    ingreso.fecha = it.cobro.fecha
                else{
                    if(it.cobro.primeraAplicacion == null){
                        println 'No Existe primera aplicacion de: ' + it.cobro.id
                        def primera = it.cobro.aplicaciones.sort {it.fecha}.first()
                        if(primera) {
                            println 'Primera aplicacion localizada: ' + primera.fecha
                            it.cobro.primeraAplicacion = primera.fecha
                            it.cobro.save flush: true
                            ingreso.fecha = primera.fecha
                        } else {
                            println "No existe primera aplicacion para el cobro: ${it.cobro.id} tipo: ${it.cobro.tipo}"
                            ingreso.fecha = cobro.fecha
                        }
                    }
                }
                ingreso.sucursal = it.cobro.sucursal.nombre
                ingreso.conceptoReporte = "Deposito suc: ${ingreso.sucursal}"
                ingreso = ingreso.save flush: true
                println "Concepto de reporte y sucursal actualizada para el deposito: ${ingreso.id}"
            }

        }
        println 'End'
    }

    def ajustarTransferenciasBancarias(Date f1, Date f2) {
        List<CobroTransferencia> transferencias = CobroTransferencia.findAll(
                "from CobroTransferencia c where date(c.cobro.primeraAplicacion) between ? and ?",
                [f1, f2])
        log.info("Transferencias a procesar: {}", transferencias.size())
        transferencias.each {
            MovimientoDeCuenta ingreso = it.ingreso
            if(ingreso) {
                ingreso.sucursal = it.cobro.sucursal.nombre
                ingreso.conceptoReporte = "Deposito suc: ${ingreso.sucursal}"
                ingreso = ingreso.save flush: true
                log.info("Concepto de reporte y sucursal actualizada Transferencia: {}", ingreso.id)
            }
        }

    }

    def generarIngresosDeTransferenciasFaltantes(Date f1, Date f2) {
        List<CobroTransferencia> transferencias = CobroTransferencia.findAll(
                "from CobroTransferencia c where date(c.cobro.primeraAplicacion) between ? and ? and c.ingreso is null",
                [f1, f2])
        log.info("Transferencias pendientes de ingreso {}", transferencias.size())
        transferencias.each {
            movimientoDecuentaService.generarIngresoPorTransferencia(it)
        }

    }

    def actualizarCortesDeTarjetas(Date d1, Date d2) {
        List<CorteDeTarjetaAplicacion> rows = CorteDeTarjetaAplicacion.findAll(
                """
                  from CorteDeTarjetaAplicacion c
                  where date(c.corte.corte) between ? and ?
                  and  c.ingreso is not null
                """, [d1, d2]
        )
        log.info('Aplicaciones de corte a actualizar {}', rows.size())
        rows.each {
            MovimientoDeCuenta ingreso = it.ingreso
            ingreso.sucursal = it.corte.sucursal.nombre
            switch (it.tipo) {
                case TipoDeAplicacion.VISAMASTER_INGRESO:
                case TipoDeAplicacion.AMEX_INGRESO:
                    ingreso.conceptoReporte = "Deposito suc: ${ingreso.sucursal}"
                    break
                case TipoDeAplicacion.AMEX_COMISION:
                    ingreso.conceptoReporte = "Comision por tarjeta Amex"
                    break
                case TipoDeAplicacion.DEBITO_COMISON:
                    ingreso.conceptoReporte = "Comision por tarjeta debito"
                    break
                case TipoDeAplicacion.CREDITO_COMISION:
                    ingreso.conceptoReporte = "Comision por tarjeta credito"
                    break
                case TipoDeAplicacion.AMEX_COMISION_IVA:
                    ingreso.conceptoReporte = "IVA comision tarjeta Amex"
                    break
                case TipoDeAplicacion.CREDITO_COMISION_IVA:
                    ingreso.conceptoReporte = "IVA comision tarjeta credito"
                    break
                case TipoDeAplicacion.DEBITO_COMISON_IVA:
                    ingreso.conceptoReporte = "IVA comision tarjeta debito"
                    break
                default:
                    break
            }
            ingreso = ingreso.save flush: true
            log.info("Concepto de reporte y sucursal actualizada para ingreso: {}", ingreso.id)

        }
    }

    def actualizarChequesDevueltos(Date f1, Date f2) {
        List<ChequeDevuelto> rows = ChequeDevuelto.findAll(
                "from ChequeDevuelto c where date(c.fecha) between ? and ? and c.egreso is not null",
                [f1, f2])
        rows.each {
            MovimientoDeCuenta egreso = it.egreso
            egreso.conceptoReporte = "Cargo por cheque dev. ${it.fecha.format('dd/MM/yyyy')}"
            egreso = egreso.save flush: true
        }
    }
}
