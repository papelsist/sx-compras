package sx.contabilidad.ingresos


import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.cxc.AplicacionDeCobro
import sx.cxc.Cobro
import sx.utils.MonedaUtils

@Slf4j
@Component
class CobranzaSaldosAFavorTask implements  AsientoBuilder{


    def generarAsientos(Poliza poliza, Map params = [:]) {

        String tipo = params.tipo

        List<AplicacionDeCobro> aplicaciones = findAplicaciones(poliza.fecha, tipo)
        if(tipo == 'CON') {
            aplicaciones = aplicaciones.findAll{it.cobro.sucursal.nombre == poliza.sucursal}
            generarContado(poliza, aplicaciones)
        } else if(tipo == 'COD') {
            aplicaciones = aplicaciones.findAll{it.cobro.sucursal.nombre == poliza.sucursal}
            generarCod(poliza, aplicaciones)
        } else if(tipo == 'CRE') {
            generarCre(poliza, aplicaciones)
        } else  if(tipo == 'CHE') {

        }

    }

    def generarContado(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CON')

            String desc = row.descripcion


            String cta = '205-0001-0001-0000'
            BigDecimal total = it.importe
            BigDecimal importe = MonedaUtils.calcularImporteDelTotal(total)
            BigDecimal iva = MonedaUtils.calcularImpuesto(importe)

            // Cargo a Aplicacion de saldos a favor CONTADO
            poliza.addToPartidas(buildDet(cta, desc, row, total))

            // Abono al cliente
            def clienteClave = "105-0001-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(clienteClave, desc, row, 0.0, total))

            // Cargo al IVA de saldo a favor
            poliza.addToPartidas(buildDet('208-0004-0000-0000', desc, row, 0.0, iva))

            // Abono al IVA pendiente
            poliza.addToPartidas(buildDet('208-0001-0000-0000', desc, row, iva))
        }
    }

    /**
     * Genera los registros contables para el caso de aplicaciones de COD
     *
     * @param poliza
     * @param aplicaciones
     * @return
     */
    def generarCod(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'COD')

            String desc = row.descripcion

            String cta = '205-0001-0002-0000'
            BigDecimal total = it.importe
            BigDecimal importe = MonedaUtils.calcularImporteDelTotal(total)
            BigDecimal iva = MonedaUtils.calcularImpuesto(importe)

            // Cargo a Aplicacion de saldos a favor CONTADO
            poliza.addToPartidas(buildDet(cta, desc, row, total))

            // Abono al cliente
            def clienteClave = "105-0002-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(clienteClave, desc, row, 0.0, total))

            // Cargo al IVA de saldo a favor
            poliza.addToPartidas(buildDet('208-0004-0000-0000', desc, row, 0.0, iva))

            // Abono al IVA pendiente
            poliza.addToPartidas(buildDet('208-0001-0000-0000', desc, row, iva))
        }
    }


    /**
     * Genera los registros contables para el caso de aplicaciones de COD
     *
     * @param poliza
     * @param aplicaciones
     * @return
     */
    def generarCre(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CRE')

            String desc = row.descripcion

            String cta = '205-0001-0003-0000'
            BigDecimal total = it.importe
            BigDecimal importe = MonedaUtils.calcularImporteDelTotal(total)
            BigDecimal iva = MonedaUtils.calcularImpuesto(importe)

            // Cargo a Aplicacion de saldos a favor CONTADO
            poliza.addToPartidas(buildDet(cta, desc, row, total))

            // Abono al cliente
            def clienteClave = "105-0002-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(clienteClave, desc, row, 0.0, total))

            // Cargo al IVA de saldo a favor
            poliza.addToPartidas(buildDet('208-0004-0000-0000', desc, row, 0.0, iva))

            // Abono al IVA pendiente
            poliza.addToPartidas(buildDet('208-0001-0000-0000', desc, row, iva))
        }
    }

    /**
     * Genera los registros contables para el caso de aplicaciones de COD
     *
     * @param poliza
     * @param aplicaciones
     * @return
     */
    def generarChe(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CHE')

            String desc = row.descripcion

            String cta = '205-0001-0003-0000'
            BigDecimal total = it.importe
            BigDecimal importe = MonedaUtils.calcularImporteDelTotal(total)
            BigDecimal iva = MonedaUtils.calcularImpuesto(importe)

            // Cargo a Aplicacion de saldos a favor CONTADO
            poliza.addToPartidas(buildDet(cta, desc, row, total))

            // Abono al cliente
            def clienteClave = "105-0002-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(clienteClave, desc, row, 0.0, total))

            // Cargo al IVA de saldo a favor
            poliza.addToPartidas(buildDet('208-0004-0000-0000', desc, row, 0.0, iva))

            // Abono al IVA pendiente
            poliza.addToPartidas(buildDet('208-0001-0000-0000', desc, row, iva))
        }
    }

    Map<String, Object> buildRow(AplicacionDeCobro a, String tipo) {
        Map map = [:]
        Cobro cobro = a.cobro
        if(cobro.cheque)  {
            map.asiento = "COB_FICHA_CHE_${tipo}_SAF_APL"
            map.descripcion = "Ficha: ${cobro.cheque?.ficha?.folio} Folio: ${cobro.cheque.folio.toString()} " +
                    "F: ${a.cuentaPorCobrar.folio} (${a.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                    " ${a.cuentaPorCobrar.tipoDocumento}" +
                    " ${a.cuentaPorCobrar.sucursal.nombre}"

        } else if(cobro.transferencia) {
            map.asiento = "COB_TRANSF_${tipo}_SAF_APL"
            map.descripcion = "Folio: ${cobro.transferencia?.folio} " +
                    "F: ${a.cuentaPorCobrar.folio} (${a.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                    " ${a.cuentaPorCobrar.tipoDocumento}" +
                    " ${a.cuentaPorCobrar.sucursal.nombre}"
            if(cobro.transferencia?.ingreso?.porIdentificar) {
                map.asiento = "COB_TRANSF_${tipo}_xIDENT_SAF_APL"
                map.porIdentificar = true
                map.ctaOperativa = cobro.transferencia.ingreso.cuenta.subCuentaOperativa
            }
        } else if(cobro.deposito) {
            map.asiento = "COB_DEP_CHE_${tipo}_SAF_APL"
            map.descripcion = "Folio: ${cobro.deposito?.folio}  " +
                    "F: ${a.cuentaPorCobrar.folio} (${a.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                    " ${a.cuentaPorCobrar.tipoDocumento}" +
                    " ${a.cuentaPorCobrar.sucursal.nombre}"
            if(cobro.deposito?.ingreso?.porIdentificar) {
                map.asiento = "COB_DEP_CHE_${tipo}_xIDENT_SAF_APL"
                map.porIdentificar = true
                map.ctaOperativa = cobro.deposito.ingreso.cuenta.subCuentaOperativa
            }
            if(cobro.formaDePago == 'DEPOSITO_EFECTIVO') {
                map.asiento = map.asiento.toString().replaceAll('CHE', 'EFE')
            }
        } else if(cobro.tarjeta) {
            map.asiento = "COB_FICHA_TAR_${tipo}_SAF_APL"
            map.descripcion = "Corte: ${cobro.tarjeta?.corteDeTarjeta?.folio ?: ''} " +
                    " Folio: ${cobro.tarjeta?.validacion} " +
                    "F: ${a.cuentaPorCobrar.folio} (${a.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                    " ${a.cuentaPorCobrar.tipoDocumento}" +
                    " ${a.cuentaPorCobrar.sucursal.nombre}"
        } else {
            map.asiento = "COB_FICHA_EFE_${tipo}_SAF_APL"
            map.descripcion = "F: ${a.cuentaPorCobrar.folio} (${a.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                    " ${a.cuentaPorCobrar.tipoDocumento}" +
                    " ${a.cuentaPorCobrar.sucursal.nombre}"
        }

        map.referencia = a.cobro.cliente.nombre
        map.referencia2 = a.cobro.cliente.nombre
        map.origen = a.cobro.id
        map.entidad = 'Cobro'
        map.documento = a.cuentaPorCobrar.documento
        map.documentoTipo =  a.cuentaPorCobrar.tipoDocumento
        map.documentoFecha = a.cuentaPorCobrar.fecha
        map.sucursal = a.cuentaPorCobrar.sucursal.nombre

        return map
    }

    List<AplicacionDeCobro> findAplicaciones(Date dia, String tpo) {
        return AplicacionDeCobro
                .where{ fecha == dia && cobro.primeraAplicacion != dia && cobro.tipo == tpo }
                .where{cobro.formaDePago != 'BONIFICACION'}
                .where{cobro.formaDePago != 'DEVOLUCION'}
                .list()
    }


    PolizaDet buildDet(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: row.entidad,
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )
        return det
    }
}
