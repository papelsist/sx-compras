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
class VentasTask implements  AsientoBuilder {

    

    @Override
    def generarAsientos(Poliza poliza, Map params = [:]) {

        log.info("Generando asientos contables para Ventas {} {}", poliza.fecha)

        String sqlVentas = getSqlVentas().replaceAll("@FECHA", toSqlDate(poliza.fecha))
        List rowsVta = getAllRows(sqlVentas, [])
        rowsVta.each{row ->

            def docto = row.documento ?: ''
            def tcCre = row.moneda == 'USD' ? "tc:${row.tc}" : ''
            def descripcion = "VENTA ${docto} ${row.fecha}  ${row.sucursal}  ${tcCre}"
            
            PolizaDet detVta = mapRow(row.cta_venta.toString(), descripcion, row,0.00, row.subtotal.abs())
            poliza.addToPartidas(detVta)

            PolizaDet detIva = mapRow(row.cta_iva.toString(), descripcion, row,0.00, row.impuesto.abs())
            poliza.addToPartidas(detIva)

            PolizaDet detCte = mapRow(row.cta_cliente.toString(), descripcion, row, row.total.abs())
            poliza.addToPartidas(detCte)
        }


 

    }


    PolizaDet mapRow(String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)

        def cto = concatenar(cuenta)

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
    String getSqlClientes() {

        String res = """
            SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
            ,f.moneda,f.tipo_de_cambio as tc,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc, f.cliente_id as cliente
            ,concat('401-0003-',(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_venta,'209-0001-0000-0000' cta_iva
            ,concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=c.id ),'-0000') as cta_cliente        
            , c.rfc, x.uuid
            FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
            join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
            where  f.fecha='@FECHA' and tipo in('CRE') and f.tipo_documento='VENTA' and f.cancelada is null and f.sw2 is null               
            UNION                
            SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
            ,f.moneda,f.tipo_de_cambio,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc
            ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente_id 
            ,concat('401-',(case when f.tipo='CON' then '0001-' when f.tipo in('COD','OTR','ACF') then '0002-' else 'nd' end ),(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_venta
            ,(case when f.tipo='CON' then '208-0001-0000-0000' else '209-0001-0000-0000' end) cta_iva
            ,concat('105-',(case when f.tipo='CON' then '0001-' when f.tipo in('COD','OTR','ACF') then '0002-' else 'nd' end ),(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_cliente               
            , c.rfc, x.uuid            
            FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
            join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
            where f.fecha='@FECHA' and tipo in('CON','COD','ACF','OTR') and f.tipo_documento='VENTA'and f.cancelada is null and f.sw2 is null 
        """

        return res
    }

    String getSqlVentas() {
        String res = """
        SELECT a.asiento,a.documentoTipo,a.moneda,a.referencia2,a.sucursal,a.suc,a.cta_venta,a.cta_iva,a.cta_cliente
        ,sum(round(a.subtotal*a.tc,2)) subtotal,sum(case when a.tc>1 then round(a.total*a.tc,2) - round(a.subtotal*a.tc,2) else a.impuesto end) impuesto,sum(round(a.total*a.tc,2)) total,
        a.fecha,case when a.documentoTipo='CRE' then a.origen else null end origen,case when a.documentoTipo='CRE' then a.documento else null end documento,documentoTipo,a.tc
        FROM (        
            SELECT concat('VENTAS_',f.tipo,(case when f.moneda='USD' then '_USD' else '' end)) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
            ,f.moneda,f.tipo_de_cambio as tc,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc, f.cliente_id as cliente
            ,concat('401-0003-',(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_venta,'209-0001-0000-0000' cta_iva
            ,concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=c.id ),'-0000') as cta_cliente
            , c.rfc, x.uuid
            FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
            join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
            where  f.fecha='@FECHA' and tipo in('CRE') and f.tipo_documento='VENTA' and f.cancelada is null and f.sw2 is null               
            UNION                
            SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
            ,f.moneda,f.tipo_de_cambio,f.subtotal,f.impuesto,f.total,concat('VENTA ',f.tipo,' ',s.nombre) referencia2,s.nombre sucursal, s.clave as suc
            ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente_id 
            ,concat('401-',(case when f.tipo='CON' then '0001-' when f.tipo in('COD','OTR','ACF') then '0002-' else 'nd' end ),(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_venta
            ,(case when f.tipo='CON' then '208-0001-0000-0000' else '209-0001-0000-0000' end) cta_iva    
            ,concat('105-',(case when f.tipo='CON' then '0001-' when f.tipo in('COD','OTR','ACF') then '0002-' else 'nd' end ),(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_cliente    
            , c.rfc, x.uuid            
            FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
            join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
            where f.fecha='@FECHA' and tipo in('CON','COD','ACF','OTR') and f.tipo_documento='VENTA'and f.cancelada is null and f.sw2 is null 
            ) as A group by a.asiento,a.documentoTipo,a.documento,a.referencia2,a.fecha,a.moneda,a.tc,a.sucursal,a.suc,a.cta_venta,a.cta_iva
        """
        return res
    }

}
