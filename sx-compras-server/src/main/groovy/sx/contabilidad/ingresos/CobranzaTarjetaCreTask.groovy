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
class CobranzaTarjetaCreTask implements  AsientoBuilder {


    /**
     * Genera los registros contables (Cargos y Abonos) para
     * los ingresos (cobranza) que se pagaron con tarjeta de credito y/o debito,
     * agupados en Cortes de tarjeta
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
        log.info("Generando asientos contables para cobranza CREDITO TARJETA  {} {}", poliza.sucursal, poliza.fecha)
        String sql = getSelect()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, [])

        // Almacenar los cobros (Para el cargo a bancos)
        Set cobros = new HashSet()
        rows.each { Map row ->

            // Cargo a banco NO DEBE REPETIRSE
            String descripcion  = generarDescripcion(row)
            if(!cobros.contains(row.origen)) {
                PolizaDet det = buildRegistro(row.cta_contable.toString(), descripcion, row)
                det.debe = row.total.abs()
                poliza.addToPartidas(det)
                cobros.add(row.origen)


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

            // Abono a clientes (Provision)
            PolizaDet clienteDet = buildRegistro(
                    row.cta_contable_fac.toString(),
                    descripcion,
                    row)
            clienteDet.haber = row.cobro_aplic
            poliza.addToPartidas(clienteDet)

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


    @Override
    String generarDescripcion(Map row) {
        return "Corte: ${row.documento_gpo} Folio: ${row.documento} F:${row.factura} (${row.fecha_fac}) ${row.tipo} ${row.sucursal}"
    }

    // QUERYES
    String getSelect() {

        String res = """
            SELECT
        'TARJETA_CRE' tipo,
        x.asiento,
        x.origen_gpo,
        x.documentoTipo,
        x.fecha,
        x.documento_gpo,
        x.moneda,
        x.tc,
        x.total_gpo,
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
        x.comision, 
        round(x.total/x.comision/100,2) imp_comision,
        round(x.total/x.comision/100,2)-round((x.total/x.comision/100)/1.16,2) comision_iva,
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
        concat('COB_TARJ_',(case when x.debito_credito is true then 'DEB' when x.visa_master is false then 'AME' else 'CRE' end),'_CON') as asiento,f.id origen_gpo,x.debito_credito,(case when x.debito_credito is true then 'DEBITO' else 'CREDITO' end)  documentoTipo,f.corte fecha,f.folio documento_gpo,b.moneda,b.tipo_de_cambio tc ,f.total total_gpo
        ,j.tipo referencia2,s.nombre sucursal, s.clave suc,'205-0007-0001-0000'  cta_contable,'000-0000-0000-0000' cta_contable2,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario
        ,b.forma_de_pago,(case when x.debito_credito is true then '99' else '04' end) metodoDePago,b.id origen,x.validacion documento,x.validacion referenciaBancaria,x.comision,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,null banco_origen_id,null bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-0003-',(SELECT x.cuenta_operativa FROM cuenta_operativa_cliente x where x.cliente_id=t.id ),'-0000') cta_contable_fac       
        ,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag      
        FROM corte_de_tarjeta f join corte_de_tarjeta_aplicacion j on(j.corte_id=f.id) join movimiento_de_cuenta m on(j.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) left join cobro_tarjeta   x on(x.corte=f.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)        
        join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) left join cfdi i on(c.cfdi_id=i.id)        
        where a.fecha='@FECHA' and a.fecha=date(b.primera_aplicacion) and b.tipo='CRE' and j.tipo like '%INGRESO%'        
        ) as x   
        group by x.origen,x.uuid, x.cxc_id 
        order by asiento desc
        """
        return res
    }

}
