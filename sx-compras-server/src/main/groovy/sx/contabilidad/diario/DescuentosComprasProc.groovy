package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.utils.MonedaUtils

@Slf4j
@Component
class DescuentosComprasProc implements  ProcesadorDePoliza, AsientoBuilder{

    @Override
    String definirConcepto(Poliza poliza) {
        return "DESCUENTOS EN  COMPRAS ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
        String select = getSelect().replaceAll('@FECHA', toSqlDate(poliza.fecha))
        // log.info(select)
        Set notas = new HashSet()
        List rows = getAllRows(select, [])
        rows.each { row ->
            // log.info('Row: {}', row)
            // Cargo a proveedores
            String descripcion = generarDescripcion(row)
            if(!notas.contains(row.origen)) {
                poliza.addToPartidas(mapRow(
                        row.cta_proveedor.toString(),
                        descripcion,
                        row,
                        row.total))
                notas.add(row.origen)
            }

            // Abono a
            poliza.addToPartidas(mapRow(
                    row.cta_contable.toString(),
                    descripcion,
                    row,
                    0.0,
                    row.subtotal))
            // Abono a IVA
            poliza.addToPartidas(mapRow(
                    row.cta_contable_iva.toString(),
                    descripcion,
                    row,
                    0.0,
                    row.impuesto))
        }
        log.info("Registros {}", rows.size())
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }



    String generarDescripcion(Map row) {
        if(row.tc > 1.0) {
            return "NC:${row.folio} F: ${row.documento} (${row.fecha_documento}) T.C. ${row.tc}"
        }
        return "NC:${row.folio} F: ${row.documento} (${row.fecha_documento}) "
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
                entidad: 'CuentaPorPagar',
                documento: row.documento,
                documentoTipo: 'FAC',
                documentoFecha: row.fecha_documento,
                sucursal: 'OFICINAS',
                debe: debe.abs(),
                haber: haber.abs()
        )
        // Datos del complemento
        asignarComprobanteNacional(det, row)
        return det
    }

    String getSelect() {
        String query =
        """
                SELECT 
        x.subtotal,        
        CASE WHEN MONEDA='USD' THEN round(X.TOTAL-X.SUBTOTAL,2) ELSE x.impuesto END impuesto,
        x.total_det,
        x.fecha_documento,
        x.documento,        
        x.sucursal,
        x.suc,
        x.fecha,
        x.moneda,
        x.tc,
        x.folio,       
        x.total, 
        x.total as montoTotal,       
        x.documentoTipo,
        x.asiento,
        x.referencia2,
        x.origen,
        x.uuid,x.rfc,
        x.proveedor,
        (case when asiento like '%FINANCIERO%' then '702-0003-0000-0000' else (case when x.cta_operativa_prov in('0038','0061') then concat('115-',(case when asiento like '%DEVOLUCION%' then '0005-' else '0007-' end),x.cta_operativa_prov,'-0000') 
        else concat('115-',(case when asiento like '%DEVOLUCION%' then '0006-' else '0008-' end),x.cta_operativa_prov,'-0000') end) end) as cta_contable ,'119-0001-0000-0000' cta_contable_iva,
        (case when x.moneda='USD' then concat('201-0003-',x.cta_operativa_prov,'-0000') when x.cta_operativa_prov in('0038','0061') then concat('201-0001-',x.cta_operativa_prov,'-0000') else concat('201-0002-',x.cta_operativa_prov,'-0000') end) cta_proveedor
        FROM (        
        SELECT concat('NOTA_CXP_',case when n.concepto like '%FINANCIER%' then 'FINANCIERO' else concepto end) asiento,n.id origen
        ,round(n.total * n.tipo_de_cambio,2) total,n.folio,n.fecha,n.concepto documentoTipo,n.moneda,n.tipo_de_cambio tc,n.proveedor_id proveedor,n.nombre referencia2
        ,round(a.importe * n.tipo_de_cambio,2) total_det,round((a.importe * n.tipo_de_cambio) / 1.16,2) subtotal,round(a.importe - round(a.importe/1.16,2) * n.tipo_de_cambio,2) impuesto
        ,c.folio documento,c.fecha fecha_documento,'OFICINAS' sucursal,1 suc
        ,(SELECT x.cuenta_operativa FROM cuenta_operativa_proveedor x where x.proveedor_id=n.proveedor_id ) as cta_operativa_prov,n.uuid,p.rfc
        FROM nota_de_credito_cxp n join aplicacion_de_pago a on(a.nota_id=n.id) join cuenta_por_pagar c on(a.cxp_id=c.id)  join proveedor p on(n.proveedor_id=p.id)
        where n.fecha = '@FECHA'
        ) as x 
        """
        return query
    }


}
