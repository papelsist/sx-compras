package sx.contabilidad.ingresos


import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.utils.MonedaUtils

import static sx.utils.MonedaUtils.*

@Slf4j
@Component
class CobranzaDepositosCreTask implements  AsientoBuilder {


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
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos contables para cobranza con DEPOSITO {} {}", poliza.sucursal, poliza.fecha)
        String sql = getSelect()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, [])

        // Almacenar los cobros (Para el cargo a bancos)

        Set cobros = new HashSet()
        rows.each { Map row ->

            // Cargo a banco NO DEBE REPETIRSE
            String descripcion  = generarDescripcion(row)
            if(!cobros.contains(row.origen)) {

                if(row.tc > 1.0) {
                    descripcion = "${descripcion} TC: ${row.tc}"
                }

                PolizaDet det = buildRegistro(
                        row.cta_contable.toString(),
                        descripcion,
                        row,
                        round(row.total * row.tc)
                )
                poliza.addToPartidas(det)
                cobros.add(row.origen)

                // 205 es una cobranza  por identificar
                if(det.cuenta.clave.startsWith('205')) {
                    det.debe = round(row.subtotal.abs() * row.tc)

                    BigDecimal impuesto = round(row.impuesto * row.tc)

                    if(row.SAF > 0 ){
                        BigDecimal total = round( (row.total - row.SAF) * row.tc )
                        BigDecimal importe = calcularImporteDelTotal(total)
                        impuesto = round(total - importe)
                    }

                    // Cargo a iva
                    PolizaDet ivaPend = buildRegistro(
                            row.cta_iva_pend.toString(),
                            descripcion, row)
                    ivaPend.debe = impuesto.abs()
                    poliza.addToPartidas(ivaPend)
                }

                if(row.SAF > 0.0) {

                    BigDecimal safTotal = round(row.SAF * row.tc)
                    BigDecimal safImporte = calcularImporteDelTotal(safTotal)
                    BigDecimal safIva = safTotal - safImporte
                    row.asiento = row.asiento + '_SAF'

                    poliza.addToPartidas(buildRegistro(
                            '205-0001-0003-0000',
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
                            '704-0003-0000-0000',
                            descripcion, row)
                    saf.haber = round(row.diferencia.abs() * row.tc)
                    saf.asiento = "${saf.asiento}_OPRD"
                    poliza.addToPartidas(saf)
                }
            }

            def desc = generarDescripcion(row)
            if(row.tc_var > 1.0) {
                descripcion = "${generarDescripcion(row)} TC: ${row.tc_var}"
            }

            // Abono a clientes (Provision)
            String ctaCliente = row.cta_contable_fac.toString()
            if(row.moneda == 'USD') {
                ctaCliente = ctaCliente.replaceAll("105-0003","105-0005")
            }
            PolizaDet clienteDet = buildRegistro(
                    ctaCliente,
                    descripcion,
                    row)
            clienteDet.haber = round(row.cobro_aplic * row.tc_var)
            poliza.addToPartidas(clienteDet)

            // IVAS
            if(!row.asiento.toString().contains('xIDENT')) {

                PolizaDet ivaPend = buildRegistro(
                        row.cta_iva_pend.toString(),
                        row.tc > 1.0 ? "${desc} TC: ${row.tc_iva_fac}": descripcion,
                        row)
                ivaPend.debe = round(row.impuesto_apl.abs() * row.tc_iva_fac)
                poliza.addToPartidas(ivaPend)

                if(row.tc > 1.0) {
                    descripcion = "${desc} TC: ${row.tc}"
                }

                PolizaDet ivaPag = buildRegistro(
                        row.cta_iva_pag.toString(),
                        descripcion,
                        row)
                ivaPag.haber = round(row.impuesto_apl.abs() * row.tc)

                poliza.addToPartidas(ivaPag)
            }

        }
        registrarVariacionCambiaria(poliza)
        registrarVariacionCambiariaIva(poliza)
        generarCuadre(poliza)
    }

    @Override
    String generarDescripcion(Map row) {
        return "Folio: ${row.documento} F:${row.factura} (${row.fecha_fac}) ${row.tipo}"
    }

    def registrarVariacionCambiaria(Poliza p) {

        def grupos = p.partidas.findAll {
            it.moneda == 'USD' &&
                    ( it.cuenta.clave.startsWith('102') || it.cuenta.clave.startsWith('105')  )}
                .groupBy { it.origen }

        grupos.each {
            BigDecimal debe = it.value.sum 0.0, {r -> r.debe}
            BigDecimal haber = it.value.sum 0.0, {r -> r.haber}

            BigDecimal dif = debe - haber
            if(dif.abs() > 1.0 ){
                log.info("Registrando variacion cambiaria: ${it.key} Debe: ${debe} Haber: ${haber} Dif: ${dif}")

                def det = it.value.find {it.cuenta.clave.startsWith('102')}

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

    def registrarVariacionCambiariaIva(Poliza p) {

        def grupos = p.partidas.findAll {it.moneda == 'USD' && ( it.cuenta.clave.startsWith('208') || it.cuenta.clave.startsWith('209') )}
                .groupBy { it.origen }

        grupos.each {
            BigDecimal debe = it.value.sum 0.0, {r -> r.debe}
            BigDecimal haber = it.value.sum 0.0, {r -> r.haber}

            BigDecimal dif = debe - haber
            if(dif.abs() > 1.0 ){
                log.info("Registrando IVA de la variacion cambiaria: ${it.key} Debe: ${debe} Haber: ${haber} Dif: ${dif}")

                def det = it.value.find {it.cuenta.clave.startsWith('208')}

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
                    pdet.asiento = det.asiento + '_VC_IVA'
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
                    pdet.asiento = det.asiento+ '_VC_IVA'
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    p.addToPartidas(pdet)
                }
            }

        }
    }

    def generarCuadre(Poliza p) {
        def grupos = p.partidas.groupBy { it.origen }
        grupos.each {
            BigDecimal debe = it.value.sum 0.0, {r -> r.debe}
            BigDecimal haber = it.value.sum 0.0, {r -> r.haber}
            BigDecimal dif = debe - haber
            if(dif.abs() > 0.0 &&  dif.abs()<=1.0){
                log.info("Generando cuadre para: ${it.key} Debe: ${debe} Haber: ${haber} Dif: ${dif}")
                def det = it.value.find {it.cuenta.clave.startsWith('102')}
                if(det == null) {
                    det = it.value.find {it.cuenta.clave.startsWith('205-0002')}
                }
                if(dif > 0.0) {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('704-0003-0000-0000')
                    pdet.sucursal = det.sucursal
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.haber = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento+ '_OPRD'
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    p.addToPartidas(pdet)

                } else {
                    PolizaDet pdet = new PolizaDet()
                    pdet.cuenta = buscarCuenta('703-0001-0000-0000')
                    pdet.sucursal = det.sucursal
                    pdet.origen = det.origen
                    pdet.referencia = det.referencia
                    pdet.referencia2 = det.referencia2
                    pdet.debe = dif.abs()
                    pdet.descripcion = det.descripcion
                    pdet.entidad = det.entidad
                    pdet.asiento = det.asiento+ '_OGST'
                    pdet.documentoTipo = det.documentoTipo
                    pdet.documentoFecha = det.documentoFecha
                    pdet.documento = det.documento
                    p.addToPartidas(pdet)
                }
            }

        }

    }

    // QUERYES
    String getSelect() {

        String res = """
         SELECT          
        'DEP_TRANSF_CRE' tipo_Cob,
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
        x.cta_iva_pag,
        x.tc_iva_fac,
        CASE WHEN MONTH('@FECHA')=MONTH(x.fecha_fac)  and x.moneda='USD' then (SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD(x.FECHA_fac, INTERVAL -1 DAY) )
        WHEN MONTH('@FECHA')<>MONTH(x.fecha_fac) and x.moneda='USD' then (SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD( CONCAT(YEAR('@FECHA'),'/',MONTH('@FECHA'),'/',01) , INTERVAL -2 DAY) ) else 1.00 end as tc_var
        FROM (    
        SELECT 
        (case when M.por_identificar is true then 'COB_TRANSF_CRE_xIDENT' else 'COB_TRANSF_CRE' end) as asiento,b.moneda,b.tipo_de_cambio tc,c.tipo_de_cambio tc_iva_fac,s.nombre sucursal, s.clave suc
        ,concat((case when M.por_identificar is true then '205-0002-' else (case when b.moneda='USD' then '102-0002-' else '102-0001-' end) end),z.sub_cuenta_operativa,'-0000') as cta_contable,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_contable2
        ,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,'03' metodoDePago,b.id origen,x.folio documento,b.referencia referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=t.id ),'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        FROM movimiento_de_cuenta m  join cuenta_de_banco z on(m.cuenta_id=z.id) join cobro_transferencia x on(x.ingreso_id=m.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join sucursal s on(b.sucursal_id=s.id) join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) left join cfdi i on(c.cfdi_id=i.id)
        where M.fecha='@FECHA' and date(b.primera_aplicacion)=a.fecha and b.tipo ='CRE'
        UNION
        SELECT 
        (case when M.por_identificar is true then 'COB_DEP_EFE_CRE_xIDENT' else 'COB_DEP_EFE_CRE' end) as asiento,b.moneda,b.tipo_de_cambio tc,c.tipo_de_cambio tc_iva_fac,s.nombre sucursal, s.clave suc
        ,concat((case when M.por_identificar is true then '205-0002-' else '102-0001-' end),z.sub_cuenta_operativa,'-0000') as cta_contable,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_contable2
        ,z.numero cta_dest,z.descripcion banco_dest,'PAPEL SA DE CV' benerficiario,b.forma_de_pago,'01' met_pago_pol,b.id origen,x.folio documento,b.referencia referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null cta_ori,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) banco_ori,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=t.id ),'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        FROM movimiento_de_cuenta m  join cuenta_de_banco z on(m.cuenta_id=z.id) join cobro_deposito x on(x.ingreso_id=m.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join sucursal s on(b.sucursal_id=s.id) join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) left join cfdi i on(c.cfdi_id=i.id)
        where M.fecha='@FECHA' and date(b.primera_aplicacion)=a.fecha and b.tipo ='CRE' and x.total_efectivo>0 and x.total_efectivo>=x.total_cheque 
        UNION
        SELECT 
        (case when M.por_identificar is true then 'COB_DEP_CHE_CRE_xIDENT' else 'COB_DEP_CHE_CRE' end) as asiento,b.moneda,b.tipo_de_cambio tc,c.tipo_de_cambio tc_iva_fac,s.nombre sucursal, s.clave suc
        ,concat((case when M.por_identificar is true then '205-0002-' else '102-0001-' end),z.sub_cuenta_operativa,'-0000') as cta_contable,(case when m.por_identificar is true then '208-0003-0000-0000' else '000-0000-0000-0000' end) cta_contable2
        ,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,'02' metodoDePago,b.id origen,x.folio documento,b.referencia referenciaBancaria,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=t.id ),'-0000') cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag
        FROM movimiento_de_cuenta m  join cuenta_de_banco z on(m.cuenta_id=z.id) join cobro_deposito x on(x.ingreso_id=m.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join sucursal s on(b.sucursal_id=s.id) join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) left join cfdi i on(c.cfdi_id=i.id)
        where M.fecha='@FECHA' and date(b.primera_aplicacion)=a.fecha and b.tipo ='CRE' and x.total_cheque>0  and x.total_efectivo<x.total_cheque
        ) as x
        """
        return res
    }

}
