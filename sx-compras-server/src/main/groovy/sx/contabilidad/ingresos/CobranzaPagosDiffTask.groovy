package sx.contabilidad.ingresos


import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.CuentaOperativaCliente
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.core.TipoDeCambio
import sx.cxc.AplicacionDeCobro
import sx.cxc.Cobro
import sx.utils.MonedaUtils
import sx.utils.Periodo

@Slf4j
@Component
class CobranzaPagosDiffTask implements  AsientoBuilder{


    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos contables para cobranza con SALDOS A FAVOR {} {}", poliza.sucursal, poliza.fecha)
        String tipo = params.tipo

        List<AplicacionDeCobro> aplicaciones = findAplicaciones(poliza.fecha, tipo).findAll {it.importe.abs() > 0.0}
        if(tipo == 'CON') {
            aplicaciones = aplicaciones.findAll{it.cobro.sucursal.nombre == poliza.sucursal}
            generarContado(poliza, aplicaciones)
        } else if(tipo == 'COD') {
            aplicaciones = aplicaciones.findAll{it.cobro.sucursal.nombre == poliza.sucursal}
            generarCod(poliza, aplicaciones)
        } else if(tipo == 'CRE') {
            List<AplicacionDeCobro> aplicacionesMxn = aplicaciones.findAll{it.cobro.moneda.currencyCode == 'MXN'}
            List<AplicacionDeCobro> aplicacionesUsd = aplicaciones.findAll{it.cobro.moneda.currencyCode == 'USD'}
            generarCredito(poliza, aplicacionesMxn)
            generarCreditoDolares(poliza, aplicacionesUsd)
            registrarVariacionCambiaria(poliza)
        } else  if(tipo == 'CHE') {
            generarChe(poliza, aplicaciones)
        } else  if(tipo == 'JUR') {
            generarJur(poliza, aplicaciones)
        }

    }

    def generarContado(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CON')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            def clienteClave = "105-0001-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
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

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            def clienteClave = "105-0002-${it.cobro.sucursal.clave.padLeft(4,'0')}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }


    /**
     * Genera los registros contables para el caso de aplicaciones de COD
     *
     * @param poliza
     * @param aplicaciones
     * @return
     */
    def generarCredito(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CRE')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'

            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            Cobro cob = it.cobro
            CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == cob.cliente}.find()
            String subCta = '0003'
            if(co.cuentaOperativa == '0266')
                subCta = '0004'
            def clienteClave = "105-${subCta}-${co.cuentaOperativa}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }

    private generarCreditoDolares(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'CRE')


            BigDecimal tc = it.cuentaPorCobrar.tipoDeCambio
            String descOrigen = row.desctipcion

            String desc = "${row.descripcion} ${tc}"


            String cta = '703-0001-0000-0000'

            BigDecimal total = MonedaUtils.round(it.importe * tc, 2)
            BigDecimal base = MonedaUtils.calcularImporteDelTotal(total)
            BigDecimal iva = total - base

            // Cargo a Aplicacion de saldos a favor
            PolizaDet det1 = buildDet(cta, desc, row, base)
            det1.moneda = 'USD'
            det1.tipCamb = tc
            poliza.addToPartidas(det1)

            String ctaIva = '209-0001-0000-0000'
            PolizaDet det2 = buildDet(ctaIva, desc, row,iva)
            det2.moneda = 'USD'
            det2.tipCamb = tc
            poliza.addToPartidas(det2)


            // Abono al cliente
            Cobro cob = it.cobro
            Date fFactura = it.cuentaPorCobrar.fecha
            Date fAplica = it.fecha
            log.info("Fecha factura: {} Fecha aplicacion: {}", fFactura, fAplica)
            boolean mismoMes = fFactura[Calendar.MONTH] == fAplica[Calendar.MONTH]

            if(!mismoMes) {
                log.info('No son del mismo mes {} {}',fFactura, fAplica)
                Date fTc = Periodo.inicioDeMes(fAplica) - 2
                TipoDeCambio enTc = TipoDeCambio.where{moneda == 'USD' && fecha == fTc}.find()
                if(enTc == null) {
                    throw new RuntimeException("No existe Tipo de cambio para el ${fTc.format('dd/MM/yyyy')}")
                }
                tc = enTc.tipoDeCambio
            }
            BigDecimal importe = MonedaUtils.round(it.importe * tc)
            CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == cob.cliente}.find()
            String subCta = '0003'
            if(co.cuentaOperativa == '0266')
                subCta = '0004'
            def clienteClave = "105-${subCta}-${co.cuentaOperativa}-0000"
            PolizaDet det4 = buildDet(
                    clienteClave,
                    "${row.descripcion} ${tc}",
                    row,
                    0.0,
                    importe)
            det4.tipCamb = tc
            det4.moneda = 'USD'
            poliza.addToPartidas(det4)
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

            Map row = buildRow(it, 'CON')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            Cobro cob = it.cobro
            CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == cob.cliente}.find()

            def clienteClave = "106-0001-${co.cuentaOperativa}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }

    def generarJur(Poliza poliza, List<AplicacionDeCobro> aplicaciones) {

        aplicaciones.each {

            Map row = buildRow(it, 'JUR')

            String desc = row.descripcion

            String cta = '703-0001-0000-0000'
            // Cargo a Aplicacion de saldos a favor
            poliza.addToPartidas(buildDet(cta, desc, row, it.importe))


            // Abono al cliente
            Cobro cob = it.cobro
            CuentaOperativaCliente co = CuentaOperativaCliente.where{cliente == cob.cliente}.find()

            def clienteClave = "106-0002-${co.cuentaOperativa}-0000"
            poliza.addToPartidas(buildDet(
                    clienteClave,
                    desc,
                    row,
                    0.0,
                    it.importe))
        }
    }

    Map<String, Object> buildRow(AplicacionDeCobro a, String tipo) {
        Map map = [:]
        Cobro cobro = a.cobro
        map.asiento = "COB_OGST_${tipo}"
        map.descripcion = "F: ${a.cuentaPorCobrar.folio} (${a.cuentaPorCobrar.fecha.format('dd/MM/yyyy')}) " +
                " ${a.cuentaPorCobrar.tipoDocumento}" +
                " ${a.cuentaPorCobrar.sucursal.nombre}"

        map.referencia = a.cobro.cliente.nombre
        map.referencia2 = a.cobro.cliente.nombre
        map.origen = a.cobro.id
        map.entidad = 'Cobro'
        map.documento = a.cuentaPorCobrar.documento
        map.documentoTipo =  a.cuentaPorCobrar.tipoDocumento
        map.documentoFecha = a.cuentaPorCobrar.fecha
        map.sucursal = a.cuentaPorCobrar.sucursal.nombre
        map.moneda = cobro.moneda.currencyCode
        map.tipCamb = a.cuentaPorCobrar.tipoDeCambio

        return map
    }

    List<AplicacionDeCobro> findAplicaciones(Date dia, String tpo) {
        return AplicacionDeCobro
                .where{ fecha == dia  && cobro.tipo == tpo }
                .where{cobro.formaDePago == 'PAGO_DIF'}
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

    def registrarVariacionCambiaria(Poliza p) {

        def grupos = p.partidas.findAll {
            it.moneda == 'USD' &&
                    ( it.cuenta.clave.startsWith('703') || it.cuenta.clave.startsWith('209') ||  it.cuenta.clave.startsWith('105'))}
        .groupBy { it.origen }

        grupos.each {
            BigDecimal debe = it.value.sum 0.0, {r -> r.debe}
            BigDecimal haber = it.value.sum 0.0, {r -> r.haber}

            BigDecimal dif = debe - haber
            if(dif.abs() > 1.0 ){
                log.info("Registrando variacion cambiaria: ${it.key} Debe: ${debe} Haber: ${haber} Dif: ${dif}")

                def det = it.value.find {it.cuenta.clave.startsWith('105')}

                if(dif > 0.0) {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('702-0004-0000-0000')
                    pdet.sucursal = det.sucursal
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.haber = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento+ '_VC'
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    p.addToPartidas(pdet)

                } else {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('701-0001-0000-0000')
                    pdet.sucursal = det.sucursal
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.debe = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento+ '_VC'
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    p.addToPartidas(pdet)
                }
            }

        }
    }
}
