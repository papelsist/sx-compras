package sx.contabilidad

import groovy.util.logging.Slf4j

import org.springframework.stereotype.Component
import sx.core.Sucursal

import static sx.contabilidad.Mapeo.*

@Slf4j
@Component
class VentasConProc extends VentasProc {

    @Override
    String getTipo() {
        return 'CON'
    }

    String getTipoLabel() {
        return 'CONTADO'
    }

    String QUERY_OLD = """
        SELECT 
        x.subtotal,
        x.impuesto,
        x.total,
        x.fecha,
        x.moneda,
        x.tc,
        x.documento,
        x.sucursal,
        x.suc,
        x.documentoTipo,
        x.asiento,
        x.referencia2,
        x.origen,
        x.cliente,
        x.cta_cliente,
        x.rfc,
        x.uuid
        FROM (        
        SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio as tc,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc, f.cliente_id as cliente
        ,concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=c.id ),'-0000') as cta_cliente, c.rfc, x.uuid
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
        where  f.fecha='@FECHA' and tipo in('CRE') and f.tipo_documento='VENTA' and x.cancelado is false and f.sw2 is null        
        UNION        
        SELECT concat('VENTAS_',f.tipo) as asiento,f.id as origen,f.tipo as documentoTipo,f.fecha,f.documento
        ,f.moneda,f.tipo_de_cambio,f.subtotal,f.impuesto,f.total,c.nombre referencia2,s.nombre sucursal, s.clave as suc
        ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente_id 
        ,concat('105-',(case when f.tipo='CON' then '0001-' when f.tipo='COD' then '0002-' else 'nd' end ),(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end),'-0000') as cta_cliente, c.rfc, x.uuid
        FROM cuenta_por_cobrar f join cliente c on(f.cliente_id=c.id)  
        join sucursal s on(f.sucursal_id=s.id) join cfdi x on(f.cfdi_id=x.id)
        where f.fecha='@FECHA' and tipo in('CON','COD') and f.tipo_documento='VENTA'and x.cancelado is false and f.sw2 is null              
        ) as x
    """
}
