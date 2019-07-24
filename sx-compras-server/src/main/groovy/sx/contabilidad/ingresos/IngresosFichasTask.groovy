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
class IngresosFichasTask implements  AsientoBuilder {


    @Override
    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos contables para cobranza con EFECTIVO {} {}", poliza.fecha)
        String sql = getFichasSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))
    
        String sqlClientes = getClienteSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))

        List rows = getAllRows(sql, [])

        rows.each{row ->
        
            String descripcion  = "Ficha: ${row.documento_gpo?:''}  ${row.fecha} ${row.sucursal}"
            // Cargo a BANCOS
            PolizaDet det = mapRow(row.cta_contable, descripcion, row, row.total)

            poliza.addToPartidas(det) 
            // cobros.add(row.origen)
              if(row.diferenciaFicha > 0.0) {
                    // FIX TEMPORAL PARA PASAR LA REFERENCIA
                    row.cliete = row.diferenciaTipo
                    row.cliente = row.diferenciaTipo
                    poliza.addToPartidas(mapRow(
                            row.cta_cajera,
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
                    poliza.addToPartidas(mapRow(
                            row.cta_cajera,
                            descripcion,
                            row,
                            row.diferenciaFicha))
                }
        }

         List rowsClientes = getAllRows(sqlClientes, [])

         rowsClientes.each{row ->
            
             String descripcion  =  ''
            if(row.forma_de_pago == 'EFECTIVO'){
                descripcion  = "F: ${row.factura} ${row.fecha_fac} ${row.sucursal}"
            }else{
                descripcion  = "Ficha: ${row.documento_gpo} CH: ${row.documento} F: ${row.factura} ${row.fecha_fac} ${row.sucursal}"
            }
            // Abono a clientes (Provision)
            PolizaDet clienteDet = mapRow(
                    row.cta_contable,
                    descripcion,
                    row)
            clienteDet.haber = row.cobro_aplic
            poliza.addToPartidas(clienteDet)

            if(row.tipo == 'COD'){

                BigDecimal importe = MonedaUtils.calcularImporteDelTotal(row.cobro_aplic)
                BigDecimal iva = row.cobro_aplic - importe

                 poliza.addToPartidas(mapRow(
                        '209-0001-0000-0000',
                        descripcion,
                        row,
                        iva))

                poliza.addToPartidas(mapRow(
                        '208-0001-0000-0000',
                        descripcion,
                        row,
                        0.0,
                        iva))
            }
  
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

    @Override
    String generarDescripcion(Map row) {

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
                entidad: row.entidad,
                documento: row.documento_gpo,
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
    String getFichasSql() {

        String res = """
        SELECT 'Ficha' entidad,case when f.tipo_de_ficha='EFECTIVO' then concat('COB_FICHA_EFE_',f.origen) else concat('COB_FICHA_CHE_',f.origen) end as asiento
        ,f.id origen_gpo,f.id origen,f.origen documentoTipo,f.fecha,f.folio documento_gpo,m.moneda,m.tipo_de_cambio tc ,f.total,f.tipo_de_ficha referencia2,s.nombre sucursal, s.clave suc
        ,concat('102-0001-',z.sub_cuenta_operativa,'-0000') cta_contable,z.numero ctaDestino,z.descripcion cliente
        ,(case when f.diferencia <0 then concat('FALTANTE_',diferencia_tipo) when f.diferencia>0 then concat('SOBRANTE_',diferencia_tipo) else '' end)  as diferenciaTipo,ifnull(f.diferencia,0) diferenciaFicha
        ,(case when diferencia=0 or diferencia is null then '000-0000-0000-0000' else concat('107-0002-',(case when f.diferencia_usuario>99 then '0' when f.diferencia_usuario>9 then '00' else '000' end),f.diferencia_usuario,'-0000') end) cta_cajera
        FROM ficha f join movimiento_de_cuenta m on(f.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id) join sucursal s on(f.sucursal_id=s.id)
        where f.fecha='@FECHA' and f.origen in('CON') 
        """
        return res
    }

    String getClienteSql() {

        String res = """
        SELECT 'Venta' entidad,concat('COB_FICHA_CHE_',f.origen) as asiento,f.id origen_gpo,f.origen documentoTipo,f.total total_gpo,f.tipo_de_ficha referencia2,f.fecha,f.folio documento_gpo
        ,b.moneda,b.tipo_de_cambio tc ,s.nombre sucursal, s.clave suc,z.numero ctaDestino,z.descripcion bancoDestino,'PAPEL SA DE CV' beneficiario
        ,b.forma_de_pago,'02' metodoDePago,b.id origen,x.numero documento,x.numero referenciaBancaria,b.importe total,(case when b.diferencia_fecha='2019-05-15' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='2019-05-15' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='2019-05-15'),0) SAF
        ,null ctaOrigen,x.banco_origen_id,(SELECT y.nombre FROM banco y where x.banco_origen_id=y.id) bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-0001-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable       
        FROM ficha f join movimiento_de_cuenta m on(f.ingreso_id=m.id) join cuenta_de_banco z on(m.cuenta_id=z.id)
        join sucursal s on(f.sucursal_id=s.id) join cobro_cheque x on(x.ficha_id=f.id) join cobro b on(x.cobro_id=b.id)  join cliente t on(b.cliente_id=t.id)
        join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where f.fecha='2019-05-15' and date(b.primera_aplicacion)=a.fecha and f.origen in('CON') 
	   UNION
        SELECT 
        'Venta' entidad,'COB_FICHA_EFE_CON' as asiento,null origen_gpo,null documentoTipo,b.importe total_gpo,'EFECTIVO' referencia2,null fecha,null documento_gpo,b.moneda,b.tipo_de_cambio tc ,s.nombre sucursal, s.clave suc        
        ,null ctaDestino,null bancoDestino,'PAPEL SA DE CV' beneficiario,b.forma_de_pago,'01' metodoDePago,b.id origen,null documento,null referenciaBancaria,b.importe total
        ,(case when b.diferencia_fecha='2019-05-15' then b.diferencia else 0 end) diferencia
        ,b.importe-(case when b.diferencia_fecha='2019-05-15' then b.diferencia else 0 end)-ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=b.id and a.fecha='2019-05-15'),0) SAF
        ,null ctaOrigen,null banco_origen_id,null bancoOrigen,t.rfc,t.nombre cliente,c.id cxc_id,c.documento factura,c.tipo,c.fecha fecha_fac,i.uuid,a.importe cobro_aplic,c.total montoTotal
        ,concat('105-',(case when b.tipo='CON' then '0001-' else '0002-' end),(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_contable_fac        
        FROM cobro b join sucursal s on(b.sucursal_id=s.id)  join cliente t on(b.cliente_id=t.id)
        join aplicacion_de_cobro a on(a.cobro_id=b.id) join cuenta_por_cobrar c on(a.cuenta_por_cobrar_id=c.id) join cfdi i on(c.cfdi_id=i.id)
        where date(b.primera_aplicacion)='2019-05-15' and date(b.primera_aplicacion)=a.fecha and b.tipo in('CON','COD') and b.forma_de_pago='EFECTIVO' 
        """
        return res
    }

}
