package sx.contabilidad.egresos


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Empresa

import sx.cxp.CuentaPorPagar
import sx.cxp.Rembolso
import sx.cxp.RembolsoDet
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils

@Slf4j
@Component
class PagoDeRembolsoTask implements  AsientoBuilder, EgresoTask {

    /**
     * Genera los asientos requreidos por la poliza
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        Rembolso r = findRembolso(poliza)
        ajustarConcepto(poliza, r)
        log.info("Pago de REMBOLSO: {} {}", r.concepto, r.id)
        switch (r.concepto) {
            case 'REMBOLSO':
                cargoSucursal(poliza, r)
                break
            case 'GASTO':
                atenderGasto(poliza, r)
                break
            case 'DEVOLUCION':
                atenderPorCuentaContableRembolso(poliza , r)
                break
            case 'PRESTAMO' :
                atenderPorCuentaContableRembolso(poliza, r)
                break
            case 'PAGO':

                CuentaContable cta = r.cuentaContable
                if(cta == null) throw new RuntimeException("No exister cuenta contable asignada al rembolso ${r.id}")

                if(cta.clave.startsWith('205-0008')) {
                    atenderDividendosHonorarios(poliza, r)
                } else if(cta.clave.startsWith('210-0001')) {
                    atenderPagoDeNomina(poliza, r)
                } else if(cta.clave.startsWith('205-D014')) {
                    atenderPagoFonacot(poliza, r)
                } else if(cta.clave.startsWith('213-0001')) {
                    atenderPagoSatImss(poliza, r)
                } else if(cta.clave.startsWith('213-0006')) {
                    atenderPagoSatImss(poliza, r)
                } else if(cta.clave.startsWith('205-0004')) {
                    atenderPagoFlete(poliza, r)
                }
                break
            case 'ESPECIAL':
                CuentaContable cta = r.cuentaContable
                if(cta == null) throw new RuntimeException("No exister cuenta contable asignada al rembolso ${r.id}")
                atenderEspecial(poliza, r)
            default:
                log.info('No hay handler para: {}', r.concepto)
        }
        abonoBanco(poliza, r)

    }


    void cargoSucursal(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        // String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia}  ${r.sucursal.nombre} "
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        Map row = [
                asiento: "REM: ${r.concepto}",
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc
        // Cargo a caja
        String cv = "101-0002-${r.sucursal.clave.padLeft(4,'0')}-0000"
        referencia: r.nombre
        referencia2: egreso.cuenta.descripcion
        PolizaDet det = mapRow(cv, desc, row, egreso.importe)
        det.referencia = det.cuenta.descripcion
        det.referencia2 = det.cuenta.descripcion
        poliza.addToPartidas(det)
    }

    void abonoBanco(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        log.info('Abono a banco: {}', egreso)

        // Abono a Banco
        Map row = buildDataRow(egreso)
        row.asiento = "REM: ${r.concepto}"
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        poliza.addToPartidas(mapRow(
                buildCuentaDeBanco(egreso),
                desc,
                row,
                0.0,
                egreso.importe.abs()))
    }



    def atenderGasto(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        r.partidas.each { d ->
            log.info('DET: {}', d)
            CuentaPorPagar cxp = d.cxp

            CuentaContable cuenta
            if(!ctaPadre.detalle) {
                String ctaOperativa = '0999'
                if(cxp) {
                    row.referencia = cxp.nombre
                    row.referencia2 = cxp.nombre
                    CuentaOperativaProveedor co = CuentaOperativaProveedor.where{ proveedor == cxp.proveedor}.find()
                    if(!co) throw new RuntimeException("No existe cuenta operativa para el proveedor: ${cxp.proveedor}")
                    ctaOperativa = co.getCuentaOperativa()
                }
                log.info('Buscando subcuenta de{} de {}',ctaOperativa, ctaPadre.clave)
                cuenta = ctaPadre.subcuentas.find{it.clave.contains(ctaOperativa)}
                if(d.comentario) {
                    CuentaContable found = CuentaContable.where{clave == d.comentario}.find()
                    if(found)
                        cuenta = found
                }

            } else {
                cuenta = ctaPadre
            }
            BigDecimal importe = d.apagar
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
            poliza.addToPartidas(mapRow(cuenta, desc, row, importe))
            if(cxp) {
                BigDecimal ivaCfdi = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva?: 0.0
                BigDecimal dif = cxp.total - d.apagar
                if(dif.abs() > 3.00) {
                    BigDecimal ii = MonedaUtils.calcularImporteDelTotal(d.apagar)
                    ivaCfdi = MonedaUtils.calcularImpuesto(ii)
                }

                if(d.comentario == 'ALIMENTOS') {
                    BigDecimal ivaAlimientos = cxp.impuestoTrasladado * 0.085
                    // BigDecimal noDeducible = cxp.impuestoTrasladado - ivaAlimientos
                    poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaAlimientos))
                    poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0,  ivaAlimientos))
                }else {
                    poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaCfdi))
                    poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, ivaCfdi))
                }


            }

        }
    }

    def atenderPorCuentaContableRembolso(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"
        Map row = [
                asiento: "REM: ${r.concepto}",
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        row.referencia = r.cuentaContable.descripcion
        row.referencia2 = r.cuentaContable.descripcion
        CuentaContable cuenta = r.cuentaContable
        if(!cuenta) {
            throw new RuntimeException("No exister cuenta contable asignada al rembolso ${r.id}")
        }
        poliza.addToPartidas(mapRow(cuenta, desc, row, egreso.importe))

    }

    def atenderPagoDeNomina(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        RembolsoDet det = r.partidas[0]

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${det.nombre} (${egreso.fecha.format('dd/MM/yyyy')})"
        poliza.concepto = "${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'}  ${r.egreso.referencia} ${det.nombre}" +
                " (${r.egreso.fecha.format('dd/MM/yyyy')}) (REM: ${r.concepto})"
        Map row = [
                asiento: "REM: ${r.concepto}",
                referencia: det.nombre,
                referencia2: det.nombre,
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc
        CuentaContable cuenta = r.cuentaContable

        poliza.addToPartidas(mapRow(cuenta, desc, row, egreso.importe))

    }



    def atenderPagoFonacot(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        r.partidas.each { d ->
            CuentaPorPagar cxp = d.cxp
            row.referencia = d.nombre
            row.referencia2 = d.nombre
            String ctaOperativa = d.comentario
            CuentaContable cuenta = ctaPadre.subcuentas.find{it.clave.contains(ctaOperativa)}
            if(!cuenta) throw new RuntimeException("No existe subcuenta ${d.comentario?: 'FALTA CO'} de ${ctaPadre.clave}")
            BigDecimal importe = d.apagar
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
            poliza.addToPartidas(mapRow(cuenta, desc, row, importe))
        }
    }

    def atenderPagoSatImss(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso

        Map row = buildDataRow(egreso)
        r.partidas.each { d ->
            String ctaClave = d.comentario // Debe traer la cuenta contable completa
            if(!ctaClave) throw new RuntimeException("No se definio la clave de la cuenta contable para el detalle ${d.id} del rembolso ${r.id}")
            BigDecimal importe = d.apagar
            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) "
            if(importe > 0) {
                poliza.addToPartidas(mapRow(ctaClave, desc, row, importe))
            } else {
                poliza.addToPartidas(mapRow(ctaClave, desc, row, 0.0,  importe))
            }

        }
    }

    def atenderPagoFlete(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)
        r.partidas.each { d ->
            CuentaPorPagar cxp = d.cxp

            row.referencia = d.nombre
            row.referencia2 = d.nombre
            CuentaOperativaProveedor co = CuentaOperativaProveedor.where{ proveedor == cxp.proveedor}.find()
            if(!co) throw new RuntimeException("No existe cuenta operativa para el proveedor: ${cxp.proveedor}")
            String ctaOperativa = co.getCuentaOperativa()
            log.info('Buscando subcuenta de{} de {}',ctaOperativa, ctaPadre.clave)
            CuentaContable cuenta = ctaPadre.subcuentas.find{it.clave.contains(ctaOperativa)}

            BigDecimal importe = d.apagar
            BigDecimal ivaCfdi = cxp.impuestoTrasladado - cxp.impuestoRetenidoIva
            log.info('Iva: {}', ivaCfdi)

            String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                    " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
            poliza.addToPartidas(mapRow(cuenta, desc, row, importe))

            poliza.addToPartidas(mapRow('118-0002-0000-0000', desc, row, ivaCfdi))
            poliza.addToPartidas(mapRow('119-0002-0000-0000', desc, row, 0.0, ivaCfdi))

            if(cxp.impuestoRetenidoIva > 0.0) {
                BigDecimal imp = cxp.impuestoRetenidoIva
                poliza.addToPartidas(mapRow('118-0003-0000-0000', desc, row, imp))
                poliza.addToPartidas(mapRow('119-0003-0000-0000', desc, row, 0.0, imp))

                poliza.addToPartidas(mapRow('216-0001-0000-0000', desc, row, imp))
                poliza.addToPartidas(mapRow('213-0011-0000-0000', desc, row, 0.0, imp))
            }


        }
    }

    def atenderDividendosHonorarios(Poliza poliza, Rembolso r) {
        MovimientoDeCuenta egreso = r.egreso

        Map row = [
                asiento: "REM: ${r.concepto}",
                origen: egreso.id,
                documentoTipo: 'REMBOLSO',
                sucursal: r.sucursal.nombre
        ]
        buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        row.referencia = r.cuentaContable.descripcion
        row.referencia2 = r.cuentaContable.descripcion
        CuentaContable cuenta = r.cuentaContable
        if(!cuenta) {
            throw new RuntimeException("No exister cuenta contable asignada al rembolso ${r.id}")
        }

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"

        poliza.addToPartidas(mapRow(cuenta, desc, row, egreso.importe))
        r.partidas.each { d ->
            String comentario = d.comentario
            if(comentario == '213-0009-0000-0000') {
                BigDecimal value =d.apagar
                value = MonedaUtils.round(value, 2)
                poliza.addToPartidas(mapRow('213-0009-0000-0000', desc, row, value))
                poliza.addToPartidas(mapRow('216-0003-0000-0000', desc, row, 0.0, value))
            }
        }

    }


    def atenderEspecial(Poliza poliza, Rembolso r) {

        MovimientoDeCuenta egreso = r.egreso
        CuentaContable ctaPadre = r.cuentaContable
        Map row = buildDataRow(egreso)

        def det = r.partidas.find {it.cxp}
        CuentaPorPagar cxp = det.cxp
        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} F:${cxp?.serie?:''} ${cxp?.folio?: ''}" +
                " (${poliza.fecha.format('dd/MM/yyyy')}) ${egreso.sucursal?: 'OFICINAS'} "
        if(cxp) {
            row.referencia = cxp.nombre
            row.referencia2 = cxp.nombre
        }

        r.partidas.each { d ->

            CuentaContable cuenta = buscarCuenta(d.comentario)
            BigDecimal importe = d.apagar
            if(importe > 0.0)
                poliza.addToPartidas(mapRow(cuenta, desc, row, importe))
            else
                poliza.addToPartidas(mapRow(cuenta, desc, row, 0.0, importe))

        }
    }



     Rembolso findRembolso(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        Rembolso r = Rembolso.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene Requisicion")
        return r
    }



    PolizaDet mapRow(CuentaContable cuenta, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'MovimientoDeCuenta',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs(),
        )
        // Datos del complemento
        if(row.uuid)
            asignarComprobanteNacional(det, row)
        if(row.metodoDePago) {
            asignarComplementoDePago(det, row)
            det.moneda = row.moneda
            det.tipCamb = row.tipCamb

        }

        return det
    }

    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'MovimientoDeCuenta',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs(),
        )
        // Datos del complemento
        if(row.uuid)
            asignarComprobanteNacional(det, row)
        if(row.metodoDePago) {
            asignarComplementoDePago(det, row)
            det.moneda = row.moneda
            det.tipCamb = row.tipCamb

        }

        return det
    }

    void ajustarConcepto(Poliza poliza, Rembolso r) {
        poliza.concepto = "${r.egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'}  ${r.egreso.referencia} ${r.egreso.afavor}" +
                " (${r.egreso.fecha.format('dd/MM/yyyy')}) (REM: ${r.concepto})"

    }

}
