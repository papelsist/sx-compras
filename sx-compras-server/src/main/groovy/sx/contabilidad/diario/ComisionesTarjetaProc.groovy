package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.tesoreria.CorteDeTarjeta
import sx.tesoreria.CorteDeTarjetaAplicacion

@Slf4j
@Component
class ComisionesTarjetaProc implements  ProcesadorDePoliza, AsientoBuilder{

    @Override
    String definirConcepto(Poliza poliza) {
        return "COMISIONES DE TARJETA (COBRANZA)${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {

        List<CorteDeTarjeta> cortes = CorteDeTarjeta.where{corte == poliza.fecha}.list().sort{it.sucursal.nombre}
        generarAsientosVisaMasterCard(poliza, cortes.findAll{it.visaMaster})
        generarAsientosAmex(poliza, cortes.findAll{!it.visaMaster})
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

    void generarAsientosVisaMasterCard(Poliza poliza, List<CorteDeTarjeta> cortes) {
        cortes.each { corte ->

            List<CorteDeTarjetaAplicacion> comisiones = corte.aplicaciones.findAll{it.tipo.toString().endsWith('COMISION')}
            comisiones.each { comision ->
                // 1. - Cargar al banco el importe de la comision y el iva
                poliza.addToPartidas(mapRow(
                        "102-0001-${corte.cuentaDeBanco.subCuentaOperativa.padLeft(4,'0')}-0000",
                        comision,
                        0.0,
                        comision.ingreso.importe
                ))
                poliza.addToPartidas(mapRow(
                        "107-0009-0001-0000",
                        comision,
                        comision.ingreso.importe
                ))

            }
            List<CorteDeTarjetaAplicacion> impuestos = corte.aplicaciones.findAll{it.tipo.toString().endsWith('IVA')}
            impuestos.each { impuesto ->
                poliza.addToPartidas(mapRow(
                        "102-0001-${corte.cuentaDeBanco.subCuentaOperativa.padLeft(4,'0')}-0000",
                        impuesto,
                        0.0,
                        impuesto.ingreso.importe
                ))
                poliza.addToPartidas(mapRow(
                        "118-0002-0000-0000",
                        impuesto,
                        impuesto.ingreso.importe
                ))
            }

        }
    }


    void generarAsientosAmex(Poliza poliza, List<CorteDeTarjeta> cortes) {

        cortes.each { corte ->
            // Abono a american express
            CorteDeTarjetaAplicacion ingreso = corte.aplicaciones.find{it.tipo.toString().endsWith('AMEX_INGRESO')}
            poliza.addToPartidas(mapRow(
                    "107-0001-0001-0000",
                    corte,
                    0.0,
                    ingreso.ingreso.importe
            ))
            CorteDeTarjetaAplicacion comision = corte.aplicaciones.find{it.tipo.toString().endsWith('AMEX_COMISION')}
            CorteDeTarjetaAplicacion iva = corte.aplicaciones.find{it.tipo.toString().endsWith('AMEX_COMISION_IVA')}
            BigDecimal toBancos = ingreso.ingreso.importe.abs() -
                    comision.ingreso.importe.abs() -
                    iva.ingreso.importe.abs()


            poliza.addToPartidas(mapRow(
                    "102-0001-${corte.cuentaDeBanco.subCuentaOperativa.padLeft(4,'0')}-0000",
                    corte,
                    toBancos
            ))
            poliza.addToPartidas(mapRow(
                    "107-0009-0011-0000",
                    corte,
                    comision.ingreso.importe
            ))
            poliza.addToPartidas(mapRow(
                    "118-0002-0000-0000",
                    corte,
                    iva.ingreso.importe
            ))

        }
    }






    PolizaDet mapRow(String cuentaClave, CorteDeTarjetaAplicacion row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        CorteDeTarjeta corte = row.corte
        String descripcion = "Corte: ${corte.folio} " +
                " ${!corte.visaMaster ? 'AMEX': 'VM'}" +
                " (${corte.corte.format('DD/MM/yyyy')}) ${corte.sucursal.nombre}"


        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: 'COMISION_TARJETA',
                referencia: row.tipo,
                referencia2: row.tipo,
                origen: corte.id,
                entidad: 'CorteDeTarjeta',
                documento: corte.folio,
                documentoTipo: 'CON',
                documentoFecha: corte.corte,
                sucursal: corte.sucursal.nombre,
                debe: debe.abs(),
                haber: haber.abs()
        )

        return det
    }


    PolizaDet mapRow(String cuentaClave, CorteDeTarjeta corte, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        String descripcion = "Corte: ${corte.folio} " +
                " ${!corte.visaMaster ? 'AMEX': 'VM'}" +
                " (${corte.corte.format('DD/MM/yyyy')}) ${corte.sucursal.nombre}"


        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: 'COMISION_TARJETA',
                referencia: 'INGRESO_AMEX',
                referencia2: 'INGRESO_AMEX',
                origen: corte.id,
                entidad: 'CorteDeTarjeta',
                documento: corte.folio,
                documentoTipo: 'CON',
                documentoFecha: corte.corte,
                sucursal: corte.sucursal.nombre,
                debe: debe.abs(),
                haber: haber.abs()
        )

        return det
    }



}
