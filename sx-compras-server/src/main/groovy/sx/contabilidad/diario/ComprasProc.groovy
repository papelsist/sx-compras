package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Cliente
import sx.cxc.ChequeDevuelto
import sx.cxc.CuentaPorCobrar
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.MonedaUtils

@Slf4j
@Component
class ComprasProc implements  ProcesadorDePoliza, AsientoBuilder{

    @Override
    String definirConcepto(Poliza poliza) {
        return "PROVISION DE COMPRAS ${poliza.fecha.format('dd/MM/yyyy')}"
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
        List rows = getAllRows(select, [])

        Set compras = new HashSet()
        rows.each { row ->

            String descripcion = generarDescripcion(row)
            // Cargo a Inventario compras
            cargoComprasInventarios(poliza, row, descripcion)

            if(!compras.contains(row.origen)) {
                if(row.flete > 0) {
                    procesarFacturaConFlete(poliza, row, descripcion)
                } else {
                    // Cargo IVA Compras
                    poliza.addToPartidas(mapRow(
                            row.cta_contable_iva.toString(),
                            descripcion,
                            row,
                            row.impuesto))
                    poliza.addToPartidas(mapRow(
                            row.cta_proveedor.toString(),
                            descripcion,
                            row,
                            0.0,
                            row.total))
                }
                if(row.diferencia > 10) {
                    poliza.addToPartidas(mapRow(
                            row.cta_desc_compra_prov.toString(),
                            descripcion,
                            row,
                            row.diferencia,
                            0.0))

                }
                procesarDiferencias(poliza, row, descripcion)
                compras.add(row.origen)
            }

        }
        // log.info('Rows: {} ', rows.size())
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

    void procesarFacturaConFlete(Poliza poliza, Map row, String descripcion){
        // Cargo IVA Compras
        def impuestoFlete = MonedaUtils.calcularImpuesto(row.flete as BigDecimal) - row.retenido as BigDecimal
        def impuesto = row.impuesto -  MonedaUtils.calcularImpuesto(row.flete as BigDecimal)
        poliza.addToPartidas(mapRow(
                row.cta_contable_iva.toString(),
                descripcion,
                row,
                impuesto))


        // Cargo IVA Compras
        poliza.addToPartidas(mapRow(
                row.cta_proveedor.toString(),
                descripcion,
                row,
                0.0,
                row.total))
        row.asiento = 'COMPRAS FLETE'
        poliza.addToPartidas(mapRow(
                '115-0004-0035-0000',
                descripcion,
                row,
                row.flete))

        poliza.addToPartidas(mapRow(
                '119-0003-0000-0000',
                descripcion,
                row,
                row.retenido))

        poliza.addToPartidas(mapRow(
                '216-0001-0000-0000',
                descripcion,
                row,
                0.0,
                row.retenido))


        poliza.addToPartidas(mapRow(
                row.cta_contable_iva.toString(),
                descripcion,
                row,
                impuestoFlete))

    }

    void cargoComprasInventarios(Poliza poliza, Map row, String descripcion) {
        // Cargo a Inventario compras
        poliza.addToPartidas(mapRow(
                row.cta_contable.toString(),
                descripcion,
                row,
                row.analisis_det))
    }

    void procesarDiferencias(Poliza poliza, Map row, String descripcion) {
        BigDecimal diferencia = row.diferencia as BigDecimal
        row.asiento = row.asiento + '_DIFF'

        if(diferencia > 0.0 && diferencia <= 10.00) {
            poliza.addToPartidas(mapRow(
                    '703-0001-0000-0000',
                    descripcion,
                    row,
                    diferencia))

        } else if(diferencia < 0.0 && diferencia >= - 10.00) {
            poliza.addToPartidas(mapRow(
                    '704-0005-0000-0000',
                    descripcion,
                    row,
                    0.0,
                    diferencia))


        }

    }

    String generarDescripcion(Map row) {
        if(row.tc > 1.0) {
            return "F:${row.documento} (${row.fecha_doc}) T.C. ${row.tc}"
        }
        return "F:${row.documento} (${row.fecha_doc}) "
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
                documentoFecha: row.fecha_doc,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )
        // Datos del complemento
        asignarComprobanteNacional(det, row)
        // asignarComplementoDePago(det, row)
        return det
    }

    String getSelect() {
        String query =
        """
         SELECT  
        x.analisis,
        (case when x.analisis_det-x.analisis BETWEEN -0.99 and 0.99 then x.analisis else x.analisis_det end) analisis_det,
        x.total_analisis,
        x.descuento,
        x.subtotal,
        CASE WHEN MONEDA='USD' THEN round(X.TOTAL-X.SUBTOTAL+X.DESCUENTO,2) ELSE x.impuesto END impuesto,
        x.retenido,
        x.total,
        x.montoTotal,
        x.flete,
        CASE WHEN MONEDA='USD' THEN x.subtotal-x.descuento-x.analisis-x.flete ELSE x.diferencia END diferencia,
        x.fecha,
        x.moneda,
        x.tc,
        x.documento,
        x.fecha_doc,
        x.sucursal,
        x.suc,
        'CMP' documentoTipo,
        case when x.diferencia BETWEEN -10 and 10 then 'COMPRA_ENTRADA' else 'COMPRA_TRANSITO' end asiento,
        x.referencia2,
        x.origen,
        x.proveedor,
        (case when x.cta_operativa_prov in('0038','0061') then concat('115-0002-',x.cta_operativa_prov,(case when x.suc>9 then '-00' else '-000' end),x.suc) else concat('115-0003-',x.cta_operativa_prov,(case when x.suc>9 then '-00' else '-000' end),x.suc) end) cta_contable,'119-0001-0000-0000' cta_contable_iva, 
        (case when x.moneda='USD' then concat('201-0003-',x.cta_operativa_prov,'-0000') when x.cta_operativa_prov in('0038','0061') then concat('201-0001-',x.cta_operativa_prov,'-0000') else concat('201-0002-',x.cta_operativa_prov,'-0000') end) cta_proveedor,
        (case when x.cta_operativa_prov in('0038','0061') then concat('115-0007-',x.cta_operativa_prov,'-0000') else concat('115-0008-',x.cta_operativa_prov,'-0000') end) cta_desc_compra_prov,
        x.uuid,
        x.rfc
        FROM (                 
        SELECT c.id origen,P.id AS proveedor,P.nombre referencia2,S.clave suc,S.nombre AS sucursal,IC.fecha
        ,concat(ifnull(c.serie,''),(case when c.serie is null or c.folio is null then '' else '-' end),ifnull(C.folio,'')) documento,C.fecha fecha_doc,C.tipo_de_cambio tc,C.moneda
        ,round((C.sub_total-c.descuento-X.importe_flete)*C.tipo_de_cambio,2) AS subtotal
        ,c.descuento
        ,ROUND(c.impuesto_trasladado * c.tipo_de_cambio, 2) impuesto
        ,c.impuesto_retenido retenido
        ,c.total as montoTotal
        ,round(c.total*c.tipo_de_cambio,2) AS total
        ,round(X.importe_flete*C.tipo_de_cambio,2) AS flete
        ,round(sum(a.importe*c.tipo_de_cambio),2) analisis_det
        ,round(x.importe*C.tipo_de_cambio,2) analisis
        ,round(SUM((A.CANTIDAD/(case when z.unidad='MIL' then 1000 else 1 end)*A.costo_unitario)*C.tipo_de_cambio)*1.16,2) AS total_analisis
        ,ROUND( ((C.sub_total-c.descuento)*C.tipo_de_cambio - ((x.importe+x.importe_flete)*C.tipo_de_cambio) ) ,2) AS diferencia
        ,(SELECT x.cuenta_operativa FROM cuenta_operativa_proveedor x where x.proveedor_id=p.id ) as cta_operativa_prov,c.uuid,p.rfc
        FROM inventario IC 
        JOIN recepcion_de_compra_det r on(r.inventariox=ic.id)
        JOIN analisis_de_factura_det A ON(r.id=A.com_id)
        JOIN analisis_de_factura X ON(A.analisis_id=X.id)
        JOIN cuenta_por_pagar C ON(C.id=X.factura_id)
        JOIN sucursal S ON(S.id=IC.SUCURSAL_ID)
        JOIN proveedor p on(c.proveedor_id=p.id)
        JOIN producto z on(ic.producto_id=z.id)
        WHERE  DATE(IC.FECHA) = '@FECHA'            
        GROUP BY P.ID,C.ID,S.ID,C.FECHA,C.MONEDA
        ORDER BY s.nombre,p.nombre,c.folio
        ) as x    
        """
        return query
    }


}
