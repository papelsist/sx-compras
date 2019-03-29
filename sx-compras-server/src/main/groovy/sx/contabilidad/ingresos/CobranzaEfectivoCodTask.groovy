package sx.contabilidad.ingresos

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.utils.MonedaUtils

@Slf4j
@GrailsCompileStatic
@Component
class CobranzaEfectivoCodTask implements  AsientoBuilder {


    /**
     * Genera los registros contables (Cargos y Abonos) para
     * los ingresos (cobranza) que se pagaron en efectivo y/o cheque,
     * agupados en Fichas de deposito
     *
     * El asiento contable es:
     *
     *  Cargo a Bancos (Por cada pago/cobro)
     *      - Abono a Clientes (n cuentas por cobrar)
     *          Cargo al IVA pendiente por cada documento
     *          Abono al IVA pagado por cada documento
     *
     * @param poliza
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos contables para cobranza con EFECTIVO {} {}", poliza.sucursal, poliza.fecha)
        String sql = getTransferenciasDepositosSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, []).findAll {it.sucursal == poliza.sucursal}

        // Almacenar los cobros (Para el cargo a bancos)
        Set cobros = new HashSet()
        rows.each { Map row ->
            // Cargo a banco NO DEBE REPETIRSE
            String descripcion  = generarDescripcion(row)
            if(!cobros.contains(row.origen) && row.cta_contable != '000-0000-0000-0000') {

                // Cargo a BANCOS
                PolizaDet det = buildRegistro(row.cta_contable.toString(), descripcion, row, row.total)
                poliza.addToPartidas(det)
                cobros.add(row.origen)

                // Abono a CAJA
                if(row.asiento == 'COB_FICHA_EFE_COD' )
                    poliza.addToPartidas(buildRegistro(row.cta_contable2.toString(), descripcion, row,0.0, row.total))

                // En caso de una cobranza de saldo a favor
                if(det.cuenta.clave.startsWith('205')) {
                    det.debe = row.subtotal.abs()
                    // Cargo a IVA
                    poliza.addToPartidas(buildRegistro(
                            row.cta_iva_pend.toString(),
                            descripcion, row, row.impuesto)
                    )
                }
                if(row.SAF > 0.0) {

                    BigDecimal safTotal = row.SAF
                    BigDecimal safImporte = MonedaUtils.calcularImporteDelTotal(safTotal)
                    BigDecimal safIva = safTotal - safImporte
                    row.asiento = row.asiento + '_SAF'

                    poliza.addToPartidas(buildRegistro(
                            '205-0001-0002-0000',
                            descripcion,
                            row,
                            0.0,
                            safImporte))

                    poliza.addToPartidas(buildRegistro(
                            '208-0004-0000-0000',
                            descripcion,
                            row,
                            0.0,
                            safIva))
                }

                if(row.diferencia > 0.0) {
                    PolizaDet saf = buildRegistro(
                            '704-0002-0000-0000',
                            descripcion, row)
                    saf.haber = row.diferencia.abs()
                    saf.asiento = "${saf.asiento}_OPRD"
                    poliza.addToPartidas(saf)
                }
            }

            if(row.cta_contable_fac != '000-0000-0000-0000') {

                // Abono a clientes (Provision)
                PolizaDet clienteDet = buildRegistro(
                        row.cta_contable_fac.toString(),
                        descripcion,
                        row)
                clienteDet.haber = row.cobro_aplic
                poliza.addToPartidas(clienteDet)

                if(row.asiento == 'COB_FICHA_EFE_COD' ) {
                    // Abono a CAJA
                    poliza.addToPartidas(buildRegistro(
                            row.cta_contable2.toString(),
                            descripcion,
                            row,
                            row.cobro_aplic ))
                }

                // IVAS
                PolizaDet ivaPend = buildRegistro(
                        row.cta_iva_pend.toString(),
                        descripcion, row)
                ivaPend.debe = row.impuesto_apl.abs()
                poliza.addToPartidas(ivaPend)

                PolizaDet ivaPag = buildRegistro(
                        row.cta_iva_pag.toString(),
                        descripcion, row)
                ivaPag.haber = row.impuesto_apl.abs()
                poliza.addToPartidas(ivaPag)
            }

        }
    }

    @Override
    String generarDescripcion(Map row) {
        if(row.origen_gpo){
            if(row.cta_contable_fac == '000-0000-0000-0000') {
                return "Ficha: ${row.documento_gpo} ${row.referencia2} ${row.sucursal} "
            }
            return "Ficha: ${row.documento_gpo} Folio: ${row.documento?:''} F:${row.factura} (${row.fecha_fac}) ${row.tipo} ${row.sucursal}"
        }


        return "F:${row.factura} (${row.fecha_fac}) ${row.tipo} ${row.sucursal}"
    }

    // QUERYES
    String getTransferenciasDepositosSql() {

        String res = """
             SELECT          
        'FICHA_CON' tipo,
        x.asiento,
        x.origen_gpo,
        x.documentoTipo,
        x.fecha,
        x.documento_gpo,
        x.moneda,
        x.tc,
        x.total_gpo,
        x.referencia2,
        x.sucursal,
        x.suc,
        x.cta_contable,
        x.cta_contable2,
        x.ctaDestino,
        x.bancoDestino,
        x.beneficiario,
        x.forma_de_pago,
        x.metodoDePago,
        x.origen,
        x.documento,
        x.referenciaBancaria,
        x.total,
        x.total as montoTotalPago,
        x.diferencia,
        x.SAF,
        x.ctaOrigen,
        x.banco_origen_id,
        x.bancoOrigen,
        x.rfc,
        x.cliente,
        x.cxc_id,
        x.factura,
        x.tipo,
        x.fecha_fac,
        x.uuid,
        round(x.cobro_aplic/1.16,2) subtotal_apl,
        x.cobro_aplic-round(x.cobro_aplic/1.16,2) impuesto_apl,
        x.cobro_aplic,
        x.montoTotal,
        x.cta_contable_fac,
        x.cta_iva_pend,
        x.cta_iva_pag
        FROM (                                                                 
        SELECT 
        concat('COB_FICHA_CHE_',f.origen) as asiento,f.id origen_gpo,f.origen documentoTipo,f.fecha,f.folio documento_gpo,b.moneda,b.tipo_de_cambio tc ,f.total total_gpo,f.tipo_de_ficha referencia2,s.nombre sucursal, s.clave suc
        ,concat('102-0001-',z.sub_cuenta_operativa,'-0000') cta_contable,'000-0000-0000-0000' cta_contable2,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario
        ,b.forma_de_pago,'02' metodoDePago,b.id origen,x.numero documento,x.numero referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-0002-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        FROM ficha f join movimiento_de_cuenta m on(f.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) left join cobro_cheque x on(x.ficha_id=f.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where f.fecha='@FECHA' and a.fecha = date(b.primera_aplicacion) and f.origen in('COD') and f.tipo_de_ficha<>'EFECTIVO' and x.cambio_por_efectivo is false                  
        ) as x  
        """
        return res
    }

}
