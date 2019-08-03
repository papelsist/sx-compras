package sx.contabilidad.ingresos

import grails.compiler.GrailsCompileStatic
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.utils.MonedaUtils
import sx.core.Sucursal

@Slf4j
@Component
class IngresosTarjetaTask implements  AsientoBuilder {


    @Override
    def generarAsientos(Poliza poliza, Map params = [:]) {

        log.info("Generando asientos contables para cobranza con EFECTIVO {} {}", poliza.fecha)
        String sql = getBancosSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, [])
        def descripcion = ""

        rows.each{Map row ->

             descripcion = "Corte: ${row.documento} ${row.documentoTipo} ${row.fecha} ${row.sucursal} "
            // Amex
            if (row.cta_contable2 == '107-0001-0001-0000') {
                
                PolizaDet detAmexCargo = mapRow(row.cta_contable2.toString(), descripcion, row)
                detAmexCargo.debe = row.total.abs()
                poliza.addToPartidas(detAmexCargo)

                PolizaDet detAmexAbono = mapRow(row.cta_contable2.toString(), descripcion, row)
                detAmexAbono.haber = row.total.abs()
                poliza.addToPartidas(detAmexAbono)
            }
      
            // Banco 
            PolizaDet det = mapRow(row.cta_contable.toString(), descripcion, row)
                det.debe = row.cta_contable2 == '107-0001-0001-0000' ? row.total2.abs() : row.total.abs()
                poliza.addToPartidas(det)

            if (row.total < 0 && !row.referencia2.startsWith('AMEX')) {
                PolizaDet detAbono = mapRow(row.cta_banco.toString(), descripcion, row)
                detAbono.haber = row.total.abs()
                poliza.addToPartidas(detAbono)
            }
        }

        String sqlClientes = getClientesSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        // Clientes
        List rowsClientes = getAllRows(sqlClientes, [])
            rowsClientes.each{row ->

                def descFac = (row.tipo == 'CON' || row.tipo == 'COD'  ) ? "F: ${row.factura} ${row.tipo} ${row.fecha} " : ""

                descripcion = "Corte: ${row.documento} ${row.documentoTipo} ${descFac} ${row.sucursal} "

               

                PolizaDet det = mapRow(row.cta_contable_fac.toString(), descripcion, row)
                det.haber= row.cobro_aplic.abs()
                poliza.addToPartidas(det)


                if(row.SAF > 0.0) {

                    BigDecimal safTotal = row.SAF
                    BigDecimal safImporte = MonedaUtils.calcularImporteDelTotal(safTotal)
                    BigDecimal safIva = safTotal - safImporte
                    row.asiento = row.asiento + '_SAF'

                    poliza.addToPartidas(mapRow(
                            '205-0001-0001-0000',
                            descripcion,
                            row,
                            0.0,
                            safImporte))

                    poliza.addToPartidas(mapRow(
                            '208-0001-0000-0000',
                            descripcion,
                            row,
                            0.0,
                            safIva))
                }

                if(row.diferencia > 0.0) {
                    log.info('Dif: {}  ROW:{}', row.diferencia, row)
                    BigDecimal diferencia = row.diferencia
                    PolizaDet saf = mapRow(
                            '704-0001-0000-0000',
                            descripcion, row, 0.0, diferencia)

                    if(diferencia == row.total && row.cobro_aplic == 0.0) {
                        log.info('ESPECIAL....')
                        saf.cuenta = buscarCuenta("101-0003-${row.suc.toString().padLeft(4,'0')}-0000")
                        saf.asiento = "${saf.asiento}"
                    } else {
                        saf.asiento = "${saf.asiento}_OPRD"
                    }
                    poliza.addToPartidas(saf)

                } 
                
            }
    }


    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'CORTE TARJETA',
                documento: row.documento,
                documentoTipo: 'CON',
                documentoFecha: row.fecha,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )

        // Datos del complemento
        // asignarComprobanteNacional(det, row)
        // asignarComplementoDePago(det, row)

        return det
    }

    // QUERYES
    String getBancosSql() {

        String res = """
        SELECT concat('COB_TARJ_',(case when j.tipo like 'AME%' then 'AME' else 'VM' end),'_CON') as asiento,F.id origen,(case when j.tipo like 'AME%' then 'AME' else 'VM' end)  documentoTipo
        ,f.corte fecha,f.folio documento,m.moneda,m.tipo_de_cambio tc ,m.importe total,j.tipo referencia2,s.nombre sucursal, s.clave suc,concat('102-0001-',z.sub_cuenta_operativa,'-0000')  cta_banco
        ,(SELECT sum(m.importe) FROM corte_de_tarjeta t join corte_de_tarjeta_aplicacion a on(a.corte_id=t.id) join movimiento_de_cuenta m on(a.ingreso_id=m.id) where t.id=f.id) total2
        ,(case when j.tipo like '%INGRESO' then concat('102-0001-',z.sub_cuenta_operativa,'-0000') when j.tipo like '%COMISION' then concat('600-0014-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') when j.tipo like '%IVA' then '118-0002-0000-0000' else '' end)  cta_contable
        ,(case when j.tipo='AMEX_INGRESO' then '107-0001-0001-0000' else '000-0000-0000-0000' end) cta_contable2,z.numero ctaDestino,z.descripcion bancoDestino
        FROM corte_de_tarjeta f join corte_de_tarjeta_aplicacion j on(j.corte_id=f.id) join movimiento_de_cuenta m on(j.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id)
        where f.corte='@FECHA'  
        """
        return res
    }

    String getClientesSql() {

        String res = """
        SELECT concat('COB_TARJ_',(case when f.visa_master is false then 'AME' else 'VM' end),'_CON') as asiento,(case when f.visa_master is false then 'AME' else 'VM' end)  documentoTipo,f.folio documento
        ,b.moneda,b.tipo_de_cambio tc,'1858193' ctaDestino,'BANAMEX SA' bancoDestino,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,(case when x.debito_credito is true then '99' else '04' end) metodoDePago,b.id origen
        ,(case when f.visa_master is true then 'VISAMASTER' else 'AMEX' end) referencia2,s.nombre sucursal, s.clave suc
        ,f.folio documento,x.validacion documento_cob,x.validacion referenciaBancaria,x.comision,b.importe total,(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='@FECHA' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='@FECHA'),0) SAF
        ,null ctaOrigen,null banco_origen_id,null bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,(case when b.tipo in('CRE','CHE','JUR') then '205-0007-0001-0000' else concat('105-',(case when b.tipo='COD' then '0002-' else '0001-' end),(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') end) cta_contable_fac
        ,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag        
        FROM corte_de_tarjeta f 
        join sucursal s on(f.sucursal_id=s.id) left join cobro_tarjeta   x on(x.corte=f.id) join cobro b on(x.cobro_id=b.id)
        join cliente t on(b.cliente_id=t.id) join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) left join cfdi i on(c.cfdi_id=i.id)
        where f.corte='@FECHA' and a.fecha=(b.primera_aplicacion)  and c.tipo in('CON','COD')       
       union
        SELECT concat('COB_TARJ_',(case when f.visa_master is false then 'AME' else 'VM' end),'_CON') as asiento,(case when f.visa_master is false then 'AME' else 'VM' end)  documentoTipo,f.folio documento_gpo
        ,b.moneda,b.tipo_de_cambio tc,'1858193' ctaDestino,'BANAMEX SA' bancoDestino,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,(case when x.debito_credito is true then '99' else '04' end) metodoDePago,b.id origen  
        ,(case when f.visa_master is true then 'VISAMASTER' else 'AMEX' end) referencia2,s.nombre sucursal, s.clave suc              
        ,f.folio documento,x.validacion documento_cob,x.validacion referenciaBancaria,x.comision,b.importe total,0 diferencia,0 SAF
        ,null ctaOrigen,null banco_origen_id,null bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,x.validacion factura,b.tipo,date(b.primera_aplicacion) fecha_fac,i.uuid,b.importe cobro_aplic,b.importe montoTotal
        ,'205-0007-0001-0000' cta_contable_fac,'209-0001-0000-0000' cta_iva_pend,'208-0001-0000-0000' cta_iva_pag        
        FROM corte_de_tarjeta f 
        join sucursal s on(f.sucursal_id=s.id) left join cobro_tarjeta   x on(x.corte=f.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)        
        join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) left join cfdi i on(c.cfdi_id=i.id)        
        where f.corte='@FECHA' and a.fecha=(b.primera_aplicacion) 
        and c.tipo not in('CON','COD')
        group by b.id  
        """
        return res
    }

}
