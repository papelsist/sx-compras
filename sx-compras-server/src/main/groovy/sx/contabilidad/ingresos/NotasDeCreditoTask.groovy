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
class NotasDeCreditoTask implements  AsientoBuilder {

    

    @Override
    def generarAsientos(Poliza poliza, Map params = [:]) {

        log.info("Generando asientos contables para Notas con EFECTIVO {} {}", poliza.fecha)
        String sql = getSqlNotas().replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, [params.tipo, params.tipo])
        def descripcion = ""

        rows.each{row ->

                descripcion = "NOTA: ${row.folio} ${row.fecha} F: ${row.documento} ${row.documentoTipo} ${row.fecha_documento} ${row.sucursal} "

                PolizaDet detNota = mapRow(row.cta_nota.toString(), descripcion, row, row.subtotal.abs())
                poliza.addToPartidas(detNota)
                
                PolizaDet detIva = mapRow("209-0001-0000-0000", descripcion, row, row.impuesto.abs())
                poliza.addToPartidas(detIva)

                if(row.aplicaciones_idx == row.max) {
                    PolizaDet detCte = mapRow(row.cta_cliente, descripcion, row, 0.00, row.total.abs())
                    poliza.addToPartidas(detCte)

                    if(row.SAF > 0.0) {
                        BigDecimal safTotal = row.SAF
                        BigDecimal safImporte = MonedaUtils.calcularImporteDelTotal(safTotal)
                        BigDecimal safIva = safTotal - safImporte
                        row.asiento = row.asiento + '_SAF'

                        poliza.addToPartidas(mapRow(
                                '205-0001-0001-0000',
                                descripcion,
                                row,
                                safImporte))

                        poliza.addToPartidas(mapRow(
                                '208-0001-0000-0000',
                                descripcion,
                                row,
                                safIva))
                    }

                    if(row.diferencia > 0.0) {
                        
                        BigDecimal diferencia = row.diferencia
                        PolizaDet saf = mapRow(
                                '703-0001-0000-0000',
                                descripcion, row, diferencia)

                        if(diferencia == row.total && row.cobro_aplic == 0.0) {
                           
                            saf.cuenta = buscarCuenta("101-0003-${row.suc.toString().padLeft(4,'0')}-0000")
                            saf.asiento = "${saf.asiento}"
                        } else {
                            saf.asiento = "${saf.asiento}_OPRD"
                        }
                        poliza.addToPartidas(saf)

                    } 
                }                  
        }

    }

    def cobranzaNotasDeCredito(Poliza poliza, Map params = [:]) {

        log.info("Generando asientos contables para cobranza de Notas  {} {}", poliza.fecha, params.tipo)
        String sql = getSqlNotas().replaceAll("@FECHA", toSqlDate(poliza.fecha))
 
        List rows = getAllRows(sql, [params.tipo, params.tipo])
        def descripcion = ""

        rows.each{row ->

                descripcion = "NOTA: ${row.folio} ${row.fecha} F: ${row.documento} ${row.documentoTipo} ${row.fecha_documento} ${row.sucursal} "   
                PolizaDet detIvaCargo = mapRow("208-0001-0000-0000", descripcion, row, row.impuesto.abs())
                PolizaDet detIvaAbono = mapRow("209-0001-0000-0000", descripcion, row, 0.0 ,row.impuesto.abs())
                poliza.addToPartidas(detIvaCargo)
                poliza.addToPartidas(detIvaAbono)

        }
    }

    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        def cto = concatenar(cuenta)
        println cto

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cto,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'CUENTA POR COBRAR',
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
    String getSqlNotas() {

        String res = """
            SELECT concat('NOTA_',substr(f.forma_de_pago,1,3),'_',f.tipo) as asiento,c.nombre referencia2,n.id as origen,f.cliente_id as cliente,n.folio,n.total ,f.tipo as documentoTipo,
            y.fecha fecha_documento,y.documento,s.nombre sucursal,f.fecha,round(a.importe/1.16,2) subtotal ,a.importe-round(a.importe/1.16,2) impuesto,a.importe total_det,f.moneda,f.tipo_de_cambio  tc,y.tipo_de_cambio tc_iva_fac,
            (case when f.diferencia_fecha='@FECHA' then f.diferencia else 0 end) diferencia,
            f.importe-(case when f.diferencia_fecha='@FECHA' then f.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=f.id and a.fecha='@FECHA'),0) SAF,
            (case when s.clave>9 then concat('403-0001-00',s.clave,'-0000') else concat('403-0001-000',s.clave,'-0000') end) cta_nota,
            (case when s.clave>9 then concat('105-0001-00',s.clave,'-0000') else concat('105-0001-000',s.clave,'-0000') end) cta_cliente,
            a.aplicaciones_idx,(select max(aplicaciones_idx) from aplicacion_de_cobro y  where y.cobro_id=f.id) as max, c.rfc, x.uuid
            FROM cobro f join aplicacion_de_cobro a on(a.cobro_id=f.id) join cliente c on(f.cliente_id=c.id)  
            join nota_de_credito n on(f.id=n.cobro_id) 
            join cfdi x on(n.cfdi_id=x.id)  join cuenta_por_cobrar y on(a.cuenta_por_cobrar_id=y.id) join sucursal s on(y.sucursal_id=s.id)
            where  a.fecha = '@FECHA' and F.forma_de_pago in('BONIFICACION') and n.sw2 is null and (x.cancelado is false or x.cancelado is null)  and f.tipo=?			
            union							
            SELECT concat('NOTA_',substr(f.forma_de_pago,1,3),'_',f.tipo) as asiento,c.nombre referencia2,n.id as origen ,f.cliente_id as cliente,n.folio,n.total,f.tipo as documentoTipo,
            y.fecha as fecha_documento,y.documento,s.nombre as sucursal ,f.fecha,round(a.importe/1.16,2) subtotal ,a.importe-round(a.importe/1.16,2) impuesto,a.importe total_det,f.moneda,f.tipo_de_cambio  tc,y.tipo_de_cambio tc_iva_fac,
            (case when f.diferencia_fecha='@FECHA' then f.diferencia else 0 end) diferencia,
            f.importe-(case when f.diferencia_fecha='@FECHA' then f.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=f.id and a.fecha='@FECHA'),0) SAF,
            (case when s.clave>9 then concat('402-0001-00',s.clave,'-0000') else concat('402-0001-000',s.clave,'-0000') end) cta_nota,
            (case when s.clave>9 then concat('105-0001-00',s.clave,'-0000') else concat('105-0001-000',s.clave,'-0000') end) cta_cliente,
            a.aplicaciones_idx,(select max(aplicaciones_idx) from aplicacion_de_cobro y  where y.cobro_id=f.id) as max, c.rfc, x.uuid
            FROM cobro f join aplicacion_de_cobro a on(a.cobro_id=f.id) join cliente c on(f.cliente_id=c.id)  join sucursal s on(f.sucursal_id=s.id) join nota_de_credito n on(f.id=n.cobro_id) 
            join cfdi x on(n.cfdi_id=x.id) join cuenta_por_cobrar y on(a.cuenta_por_cobrar_id=y.id)
            where  a.fecha = '@FECHA' and F.forma_de_pago in('DEVOLUCION') and n.sw2 is null and (x.cancelado is false or x.cancelado is null)  and f.tipo = ?
        """
        return res
    }

}
