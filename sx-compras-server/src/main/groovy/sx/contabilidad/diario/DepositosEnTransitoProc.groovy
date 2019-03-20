package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.tesoreria.CorteDeTarjeta
import sx.tesoreria.CorteDeTarjetaAplicacion
import sx.utils.Periodo

@Slf4j
@Component
class DepositosEnTransitoProc implements  ProcesadorDePoliza, AsientoBuilder{

    @Override
    String definirConcepto(Poliza poliza) {

            return "DEPOSITOS EN TRANSITO ${poliza.fecha.format('dd/MM/yyyy')} (Cancelacion)"

            if(poliza.fecha.format('dd/MM/yyyy').date < 15){
                    return "DEPOSITOS EN TRANSITO ${poliza.fecha.format('dd/MM/yyyy')} (Traspaso)"
            }

        
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
            
        List<CorteDeTarjeta> cortes = CorteDeTarjeta.where{fechaDeposito == poliza.fecha && fechaDeposito != corte}.list().sort{it.sucursal.nombre}
        List<CorteDeTarjeta> cortesTransito = CorteDeTarjeta.executeQuery("from CorteDeTarjeta where month(corte) = month(${poliza.fecha})  and  year(corte) = year(${poliza.fecha}) and date(fechaDeposito) > (${poliza.fecha})")
       

        if(cortes){
                
                generarAsientosTraspasoAmex(poliza, cortes.findAll{!it.visaMaster})
        }else{
                
                 generarAsientosTransito(poliza, cortesTransito.findAll{!it.visaMaster})
        }

        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

    void generarAsientosTransito(Poliza poliza, List<CorteDeTarjeta> cortes){

        cortes.each { corte ->
            // Abono a american express

            CorteDeTarjetaAplicacion ingreso = corte.aplicaciones.find{it.tipo.toString().endsWith('AMEX_INGRESO')}
            poliza.addToPartidas(mapRow(
                    "107-0001-0001-0000",
                    corte,
                    ingreso.ingreso.importe,
                    0.0
                    
            ))
            CorteDeTarjetaAplicacion comision = corte.aplicaciones.find{it.tipo.toString().endsWith('AMEX_COMISION')}
            CorteDeTarjetaAplicacion iva = corte.aplicaciones.find{it.tipo.toString().endsWith('AMEX_COMISION_IVA')}
            BigDecimal toBancos = ingreso.ingreso.importe.abs() -
                    comision.ingreso.importe.abs() -
                    iva.ingreso.importe.abs()


            poliza.addToPartidas(mapRow(
                    "102-0001-${corte.cuentaDeBanco.subCuentaOperativa.padLeft(4,'0')}-0000",
                    corte,
                    0.0,
                    toBancos
            ))
            poliza.addToPartidas(mapRow(
                    "600-0013-${corte.sucursal.clave.padLeft(4,'0')}-0000",
                    corte,
                    0.0,
                    comision.ingreso.importe
            ))
            poliza.addToPartidas(mapRow(
                    "119-0002-0000-0000",
                    corte,
                    0.0,
                    iva.ingreso.importe
            ))

        }

    }

    void generarAsientosTraspasoAmex(Poliza poliza, List<CorteDeTarjeta> cortes) {

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
                    "600-0013-${corte.sucursal.clave.padLeft(4,'0')}-0000",
                    corte,
                    comision.ingreso.importe
            ))
            poliza.addToPartidas(mapRow(
                    "119-0002-0000-0000",
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
                asiento: 'PENDIENTE',
                referencia: row.tipo,
                referencia2: row.tipo,
                origen: corte.id,
                entidad: 'MovimientoDeCuenta',
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
                asiento: 'PENDIENTE',
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
