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
class CobranzaEfectivoTask implements  AsientoBuilder {


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

                // En caso de sobrantes

                if(row.diferenciaFicha > 0.0) {
                    // FIX TEMPORAL PARA PASAR LA REFERENCIA
                    row.cliete = row.diferenciaTipo
                    row.cliente = row.diferenciaTipo

                    poliza.addToPartidas(buildRegistro(
                            row.cta_caja.toString(),
                            descripcion,
                            row,
                            row.diferenciaFicha)
                    )
                    poliza.addToPartidas(buildRegistro(
                            row.cta_cajera.toString(),
                            descripcion,
                            row,
                            0.0,
                            row.diferenciaFicha))
                }
                // En caso de faltantes
                else if(row.diferenciaFicha < 0.0) {
                    // FIX TEMPORAL PARA PASAR LA REFERENCIA
                    row.cliete = row.diferenciaTipo
                    row.cliente = row.diferenciaTipo

                    poliza.addToPartidas(buildRegistro(
                            row.cta_caja.toString(),
                            descripcion,
                            row,
                            0.0,
                            row.diferenciaFicha)
                    )
                    poliza.addToPartidas(buildRegistro(
                            row.cta_cajera.toString(),
                            descripcion,
                            row,
                            row.diferenciaFicha))
                }


                // Abono a CAJA
                if(row.asiento == 'COB_FICHA_EFE_CON' )
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

                if(row.saf > 0.0) {

                    BigDecimal safTotal = row.SAF
                    BigDecimal safImporte = MonedaUtils.calcularImporteDelTotal(safTotal)
                    BigDecimal safIva = safTotal - safImporte
                    row.asiento = row.asiento + '_SAF'

                    poliza.addToPartidas(buildRegistro(
                            '205-0001-0001-0000',
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
                            '704-0001-0000-0000',
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

                if(row.asiento == 'COB_FICHA_EFE_CON' ) {
                    // Abono a CAJA
                    poliza.addToPartidas(buildRegistro(
                            row.cta_contable2.toString(),
                            descripcion,
                            row,
                            row.cobro_aplic ))
                }
                // IVAS
                poliza.addToPartidas(buildRegistro(
                        row.cta_iva_pend.toString(),
                        descripcion,
                        row,
                        row.impuesto_apl))

                poliza.addToPartidas(buildRegistro(
                        row.cta_iva_pag.toString(),
                        descripcion,
                        row,
                        0.0,
                        row.impuesto_apl))

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
        (case when x.forma_de_pago='CHEQUE' and x.asiento='COB_FICHA_EFE_CON'  then 0 else x.total end) as montoTotalPago,
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
        x.cta_iva_pag,
        x.diferenciaTipo,
        x.diferenciaFicha,
        x.cta_caja,
        x.cta_cajera 
        FROM (                                                                 
        SELECT 
        concat('COB_FICHA_EFE_',f.origen) as asiento,f.id origen_gpo,f.origen documentoTipo,f.fecha,f.folio documento_gpo,b.moneda,b.tipo_de_cambio tc ,f.total total_gpo,f.tipo_de_ficha referencia2,s.nombre sucursal, s.clave suc
        ,concat('102-0001-',z.sub_cuenta_operativa,'-0000') cta_contable,concat('101-0003-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable2,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario
        ,b.forma_de_pago,null metodoDePago,b.id origen,x.numero documento,x.numero referenciaBancaria,b.importe total,0 diferencia,0 SAF        
        ,null ctaOrigen,x.banco_origen_id,null bancoOrigen,t.rfc,t.nombre cliente,null cxc_id,null factura,null tipo,null fecha_fac,null uuid,0 cobro_aplic,0 montoTotal
        ,'000-0000-0000-0000' cta_contable_fac,'000-0000-0000-0000' cta_iva_pend,'000-0000-0000-0000' cta_iva_pag,'' diferenciaTipo,0 diferenciaFicha,'000-0000-0000-0000' cta_caja,'000-0000-0000-0000' cta_cajera 
        FROM ficha f join movimiento_de_cuenta m on(f.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) left join cobro_cheque x on(x.ficha_id=f.id) left join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)        
        where f.fecha='@FECHA' and f.origen in('CON') and f.tipo_de_ficha<>'EFECTIVO' and x.cambio_por_efectivo is true
        UNION        
        SELECT 
        concat('COB_FICHA_EFE_',f.origen) as asiento,f.id origen_gpo,f.origen documentoTipo,f.fecha,f.folio documento_gpo,'MXN' moneda,1 tc ,f.total total_gpo,f.tipo_de_ficha referencia2,s.nombre sucursal, s.clave suc
        ,concat('102-0001-',z.sub_cuenta_operativa,'-0000') cta_contable,concat('101-0003-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable2,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario
        ,'EFECTIVO' forma_de_pago,'01' metodoDePago,concat('Ficha: ',cast(f.folio as char(8))) origen,null documento,null referenciaBancaria,f.total,0 diferencia,0 SAF        
        ,null ctaOrigen,null banco_origen_id,null bancoOrigen,null rfc,null cliente,null cxc_id,null factura,null tipo,null fecha_fac,null uuid,0 cobro_aplic,0 montoTotal
        ,'000-0000-0000-0000' cta_contable_fac,'000-0000-0000-0000' cta_iva_pend,'000-0000-0000-0000' cta_iva_pag
        ,(case when f.diferencia <0 then concat('FALTANTE_',diferencia_tipo) when f.diferencia>0 then concat('SOBRANTE_',diferencia_tipo) else '' end)  as diferenciaTipo,ifnull(f.diferencia,0) diferenciaFicha
        ,(case when diferencia=0 or diferencia is null then '000-0000-0000-0000' else concat('101-0003-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') end) cta_caja
        ,(case when diferencia=0 or diferencia is null then '000-0000-0000-0000' else concat('107-0002-',(case when f.diferencia_usuario>99 then '0' when f.diferencia_usuario>9 then '00' else '000' end),f.diferencia_usuario,'-0000') end) cta_cajera
        FROM ficha f join movimiento_de_cuenta m on(f.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id) join sucursal s on(f.sucursal_id=s.id)     
        where f.fecha='@FECHA' and f.origen in('CON') and f.tipo_de_ficha='EFECTIVO'
        UNION                                                                 
        SELECT 
        'COB_FICHA_EFE_CON' as asiento,null origen_gpo,null documentoTipo,null fecha,null documento_gpo,b.moneda,b.tipo_de_cambio tc ,b.importe total_gpo,'EFECTIVO' referencia2,s.nombre sucursal, s.clave suc
        ,'000-0000-0000-0000' cta_contable,concat('101-0003-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable2,null ctaDestino,null bancoDestino,'PAPEL SA DE CV' beneficiario
        ,b.forma_de_pago,'01' metodoDePago,b.id origen,null documento,null referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,null banco_origen_id,null bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-',(case when b.tipo='CON' then '0001-' else '0002-' end),(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        ,'' diferenciaTipo,0 diferencia,'000-0000-0000-0000' cta_caja,'000-0000-0000-0000' cta_cajera 
        FROM cobro b join sucursal s on(b.sucursal_id=s.id)  join cliente t on(b.cliente_id=t.id)
        join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where date(b.primera_aplicacion)='@FECHA' and b.tipo in('CON','COD') and b.forma_de_pago='EFECTIVO' 
        UNION
        SELECT concat('COB_FICHA_CHE_',f.origen) as asiento,f.id origen_gpo,f.origen documentoTipo,f.fecha,f.folio documento_gpo,b.moneda,b.tipo_de_cambio tc ,f.total total_gpo,f.tipo_de_ficha referencia2,s.nombre sucursal, s.clave suc
        ,concat('102-0001-',z.sub_cuenta_operativa,'-0000') cta_contable,'000-0000-0000-0000' cta_contable2,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario
        ,b.forma_de_pago,'02' metodoDePago,b.id origen,x.numero documento,x.numero referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-0001-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        ,'' diferenciaTipo,0 diferencia,'000-0000-0000-0000' cta_caja,'000-0000-0000-0000' cta_cajera 
        FROM ficha f join movimiento_de_cuenta m on(f.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) left join cobro_cheque x on(x.ficha_id=f.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where f.fecha='@FECHA' and f.origen in('CON') and f.tipo_de_ficha<>'EFECTIVO' and x.cambio_por_efectivo is false 
        ) as x
        """
        return res
    }

}
