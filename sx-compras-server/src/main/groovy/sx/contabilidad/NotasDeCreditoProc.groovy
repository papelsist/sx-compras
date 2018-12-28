package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.core.Cliente
import sx.core.Sucursal
import static sx.contabilidad.Mapeo.*


@Slf4j
@Component
class NotasDeCreditoProc implements  ProcesadorDePoliza{

    String QUERY = """
        SELECT 
        x.subtotal,
        x.impuesto,
        x.total_det,
        x.fecha_documento,
        x.documento,
        x.sucursal,
        x.fecha,
        x.moneda,
        x.tc,
        x.folio,
        x.total,        
        x.documentoTipo,
        x.asiento,
        x.referencia2,
        x.origen,
        x.cliente,
        x.cta_cliente,
        x.partidas_idx,
        x.max
        FROM (                
          SELECT round((d.importe/1.16),2) subtotal ,d.importe-round((d.importe/1.16),2) impuesto,d.importe total_det,d.fecha_documento,d.documento,d.sucursal,f.fecha,f.moneda,f.tipo_de_cambio  tc ,n.folio,n.total ,f.tipo as documentoTipo,
		concat('NOTA_',substr(f.forma_de_pago,1,3),'_',f.tipo) as asiento,c.nombre referencia2,n.id as origen,f.cliente_id as cliente,
		concat((case when f.tipo='CRE' then concat('105-0003-', (SELECT x.cuenta_operativa FROM cuenta_operativa_cliente x where x.cliente_id=c.id )) 
				when f.tipo='CON' then (case when s.clave>9 then concat('105-0001-00',s.clave) else concat('105-0001-000',s.clave) end)
				when f.tipo='COD' then (case when s.clave>9 then concat('105-0002-00',s.clave) else concat('105-0002-000',s.clave) end)
				else 'no_cta' end),'-0000') as cta_cliente,d.partidas_idx,(select max(partidas_idx) from nota_de_credito_det y  where y.nota_id=n.id) as max
		FROM cobro f join cliente c on(f.cliente_id=c.id)  
		join nota_de_credito n on(f.id=n.cobro_id) left join nota_de_credito_det d on(d.nota_id=n.id)  join sucursal s on(d.sucursal=s.nombre)
		join cfdi x on(n.cfdi_id=x.id)
		where  f.fecha = '@FECHA' and F.forma_de_pago in('BONIFICACION') and n.sw2 is null and (x.cancelado is false or x.cancelado is null)		
		union
		SELECT n.importe subtotal ,n.impuesto,n.total,y.fecha as fecha_documento,y.documento,s.nombre as sucursal ,f.fecha,f.moneda,f.tipo_de_cambio  tc ,n.folio,n.total,f.tipo as documentoTipo,
		concat('NOTA_',substr(f.forma_de_pago,1,3),'_',f.tipo) as asiento,c.nombre referencia2,n.id as origen ,f.cliente_id as cliente,
		concat((case when f.tipo='CRE' then concat('105-0003-', (SELECT x.cuenta_operativa FROM cuenta_operativa_cliente x where x.cliente_id=c.id )) 
				when f.tipo='CON' then (case when s.clave>9 then concat('105-0001-00',s.clave) else concat('105-0001-000',s.clave) end)
				when f.tipo='COD' then (case when s.clave>9 then concat('105-0002-00',s.clave) else concat('105-0002-000',s.clave) end)
				else 'no_cta' end),'-0000') as cta_cliente,0,0	
		FROM cobro f join cliente c on(f.cliente_id=c.id)  join sucursal s on(f.sucursal_id=s.id) join nota_de_credito n on(f.id=n.cobro_id) 
		join cfdi x on(n.cfdi_id=x.id)  join devolucion_de_venta d on(d.cobro_id=f.id)  join venta v on(d.venta_id=v.id) join cuenta_por_cobrar y on(v.cuenta_por_cobrar_id=y.id)
		where  f.fecha = '@FECHA' and F.forma_de_pago in('DEVOLUCION') and n.sw2 is null and (x.cancelado is false or x.cancelado is null)  		                      
        ) as x
    """

    @Override
    String definirConcepto(Poliza poliza) {
        return "Notas de credito"
    }

    @Override
    Poliza recalcular(Poliza poliza) {

        poliza.partidas.clear()
        String select = QUERY.replaceAll('@FECHA', toSqlDate(poliza.fecha))
        List rows = getAllRows(select, [])
        log.info('Procesando poliza {}  {} registros', poliza.tipo, poliza.subtipo)

        

        rows.each { row ->
                cargoNotas(poliza,row)
                abonoIvaNoTrasladado(poliza,row)
                if(row.partidas_idx == row.max)
                    abonoCliente(poliza,row)
        }

   
            



        return poliza
    }


    def cargoNotas(Poliza poliza, def row){

        String tipo = row.documentoTipo

       def ctaPrimero =''
    
        if(row.asiento.startsWith('NOTA_DEV')){
              ctaPrimero = '402'
        }
        if(row.asiento.startsWith('NOTA_BON')){
            
               ctaPrimero = '403'
        }

        def ctaSegundo = ''

        switch (tipo) {
            case 'CON':
                ctaSegundo= '-0001-'
                break
            case 'COD':
                ctaSegundo= '-0002-'
                break
            case 'CRE':
                ctaSegundo= '-0003-'
                break
        }

        def ctaTercero = ''

        def sucursal = Sucursal.findByNombre(row.sucursal).clave
        if( new Integer(sucursal).intValue() < 10){
            ctaTercero = "000"+sucursal
        }else{
            ctaTercero = "00"+sucursal 
        }
        


        CuentaContable cuenta = buscarCuenta(ctaPrimero+ctaSegundo+ctaTercero+"-0000")

        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable para el cargo a notas del reg: ${row}")
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'CuentaPorCobrar',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.fecha,
                sucursal: row.sucursal,
                haber: 0.0,
                debe: row.subtotal
        )
        poliza.addToPartidas(det)

    }

     def abonoIvaNoTrasladado(Poliza poliza, def row) {

        CuentaContable cuenta = buscarCuenta(IvaNoTrasladadoVentas.clave)
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia2,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'CuentaPorCobrar',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.fecha,
                sucursal: row.sucursal,
                haber: 0.0,
                debe: row.impuesto
        )
        poliza.addToPartidas(det)
    }

    def abonoCliente(Poliza poliza, def row){
        
        if(row.cta_cliente == null) {
            throw new RuntimeException("No existe cuenta para el cliente:  ${row.cliente}")
        }

        CuentaContable cuenta = CuentaContable.findByClave(row.cta_cliente)
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "F: ${row.documento} ${row.fecha.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal}"
        PolizaDet det = new PolizaDet(
            cuenta: cuenta,
            concepto: cuenta.descripcion,
            descripcion: descripcion,
            asiento: row.asiento,
            referencia: row.referencia2,
            referencia2: row.referencia2,
            origen: row.origen,
            entidad: 'CuentaPorCobrar',
            documento: row.documento,
            documentoTipo: row.documentoTipo,
            documentoFecha: row.fecha,
            sucursal: row.sucursal,
            haber: row.total,
            debe: 0.0
        )
        poliza.addToPartidas(det)
    }

}
