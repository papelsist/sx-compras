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
@Component
class CobranzaDepositosTask implements  AsientoBuilder {


    /**
     * Genera los registros contables (Cargos y Abonos) para
     * los ingresos que se pagaron con transferencia y deposito, es decir
     * solicitudes de deposito autorizadas que se usaron en la cobranza
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
    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos contables para cobranza con DEPOSITOS/TRANSFERENCIAS {} {}", poliza.sucursal, poliza.fecha)
        String sql = getSelect()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, []).findAll {it.sucursal == poliza.sucursal}

        generarAsientos(poliza, rows)

        // Almacenar los cobros (Para el cargo a bancos)

        Set cobros = new HashSet()
        rows.each { Map row ->
            // Cargo a banco NO DEBE REPETIRSE
            String descripcion  = generarDescripcion(row)
            if(!cobros.contains(row.origen)) {

                PolizaDet det = buildRegistro(row.cta_contable.toString(), descripcion, row, row.total)
                poliza.addToPartidas(det)
                cobros.add(row.origen)

                // 205 es una cobranza  por identificar
                if(det.cuenta.clave.startsWith('205')) {
                    det.debe = row.subtotal.abs()

                    BigDecimal impuesto = row.impuesto
                    if(row.SAF > 0 ){
                        BigDecimal total = row.total - row.SAF
                        BigDecimal importe = MonedaUtils.calcularImporteDelTotal(total)
                        impuesto = MonedaUtils.round(total - importe)
                    }

                    // Cargo a iva
                    PolizaDet ivaPend = buildRegistro(
                            row.cta_iva_pend.toString(),
                            descripcion, row)
                    ivaPend.debe = impuesto.abs()
                    poliza.addToPartidas(ivaPend)
                }
                if(row.SAF > 0.0) {

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
                    if(!row.asiento.toString().contains('xIDENT')) {
                        poliza.addToPartidas(buildRegistro(
                                '208-0004-0000-0000',
                                descripcion,
                                row,
                                0.0,
                                safIva))
                    }
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

            // Abono a clientes (Provision)
            PolizaDet clienteDet = buildRegistro(
                    row.cta_contable_fac.toString(),
                    descripcion,
                    row)
            clienteDet.haber = row.cobro_aplic
            poliza.addToPartidas(clienteDet)

            // IVAS
            if(!row.asiento.toString().contains('xIDENT')) {
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


    def generarAsientosIngresos(Poliza poliza , Map params = [:] ){

        log.info("Generando asientos contables para cobranza con DEPOSITOS/TRANSFERENCIAS {} {}", poliza.sucursal, poliza.fecha)
        String sql = getSelect()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))
        List rows = getAllRows(sql, [])
            generarAsientos(poliza, rows)
    }


    def generarAsientos(Poliza poliza, List<Map> rows){

        Set cobros = new HashSet()

        rows.each{ row ->
            String descripcion  = generarDescripcion(row)
                if(!cobros.contains(row.origen)) {

                PolizaDet det = buildRegistro(row.cta_contable.toString(), descripcion, row, row.total)
                poliza.addToPartidas(det)
                cobros.add(row.origen)

                // 205 es una cobranza  por identificar
                if(det.cuenta.clave.startsWith('205')) {
                    det.debe = row.subtotal.abs()

                    BigDecimal impuesto = row.impuesto
                    if(row.SAF > 0 ){
                        BigDecimal total = row.total - row.SAF
                        BigDecimal importe = MonedaUtils.calcularImporteDelTotal(total)
                        impuesto = MonedaUtils.round(total - importe)
                    }

                    // Cargo a iva
                    PolizaDet ivaPend = buildRegistro(
                            row.cta_iva_pend.toString(),
                            descripcion, row)
                    ivaPend.debe = impuesto.abs()
                    poliza.addToPartidas(ivaPend)
                }

                    if(row.SAF > 0.0) {

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
                                /*
                        if(!row.asiento.toString().contains('xIDENT')) {
                            poliza.addToPartidas(buildRegistro(
                                    '208-0001-0000-0000',
                                    descripcion,
                                    row,
                                    0.0,
                                    safIva))
                        }
                        */
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

                // Abono a clientes (Provision)
                PolizaDet clienteDet = buildRegistro(
                        row.cta_contable_fac.toString(),
                        descripcion,
                        row)
                clienteDet.haber = row.cobro_aplic
                poliza.addToPartidas(clienteDet)
/*

                // IVAS
                if(!row.asiento.toString().contains('xIDENT')) {
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
                */
        }


    }

    @Override
    String generarDescripcion(Map row) {
        return "Folio: ${row.documento} F:${row.factura} (${row.fecha_fac}) ${row.tipo} ${row.sucursal}"
    }

    // QUERYES
    String getSelect() {

        String res = """
        SELECT          
        'DEP_TRANSF_CON' tipo_Cob,
        x.asiento,       
        x.moneda,
        x.tc,
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
        round(x.total/1.16,2) subtotal,
        x.total-round(x.total/1.16,2) impuesto,
        x.total ,
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
        (case when M.por_identificar is true then 'COB_TRANSF_CON_xIDENT' else 'COB_TRANSF_CON' end) as asiento,b.moneda,b.tipo_de_cambio tc,s.nombre sucursal, s.clave suc
        ,concat((case when M.por_identificar is true then '205-0002-' else '102-0001-' end),z.sub_cuenta_operativa,'-0000') as cta_contable,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_contable2
        ,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,'03' metodoDePago,b.id origen,x.folio documento,b.referencia referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-0001-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        FROM movimiento_de_cuenta m  join cuenta_de_banco z on(m.cuenta_id=z.id) join cobro_transferencia x on(x.ingreso_id=m.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join sucursal s on(b.sucursal_id=s.id) join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where M.fecha='@FECHA' and date(b.primera_aplicacion)=a.fecha and b.tipo ='CON' 
        UNION
        SELECT 
        (case when M.por_identificar is true then 'COB_DEP_EFE_CON_xIDENT' else 'COB_DEP_EFE_CON' end) as asiento,b.moneda,b.tipo_de_cambio tc,s.nombre sucursal, s.clave suc
        ,concat((case when M.por_identificar is true then '205-0002-' else '102-0001-' end),z.sub_cuenta_operativa,'-0000') as cta_contable,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_contable2
        ,z.numero cta_dest,z.descripcion banco_dest,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,'01' met_pago_pol,b.id origen,x.folio documento,b.referencia referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null cta_ori,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) banco_ori,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-0001-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        FROM movimiento_de_cuenta m  join cuenta_de_banco z on(m.cuenta_id=z.id) join cobro_deposito x on(x.ingreso_id=m.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join sucursal s on(b.sucursal_id=s.id) join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where M.fecha='@FECHA' and date(b.primera_aplicacion)=a.fecha and b.tipo ='CON' and x.total_efectivo>0 and x.total_efectivo>=x.total_cheque
        UNION                                                                        
        SELECT 
        (case when M.por_identificar is true then 'COB_DEP_CHE_CON_xIDENT' else 'COB_DEP_CHE_CON' end) as asiento,b.moneda,b.tipo_de_cambio tc,s.nombre sucursal, s.clave suc
        ,concat((case when M.por_identificar is true then '205-0002-' else '102-0001-' end),z.sub_cuenta_operativa,'-0000') as cta_contable,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_contable2
        ,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,'02' metodoDePago,b.id origen,x.folio documento,b.referencia referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-0001-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        FROM movimiento_de_cuenta m  join cuenta_de_banco z on(m.cuenta_id=z.id) join cobro_deposito x on(x.ingreso_id=m.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join sucursal s on(b.sucursal_id=s.id) join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where M.fecha='@FECHA' and date(b.primera_aplicacion)=a.fecha and b.tipo ='CON' and x.total_cheque>0  and x.total_efectivo<x.total_cheque
        ) as x
        """
        return res
    }

}
