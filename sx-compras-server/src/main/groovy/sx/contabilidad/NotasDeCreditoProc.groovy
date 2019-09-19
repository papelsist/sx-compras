package sx.contabilidad

import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component

import sx.core.Sucursal
import sx.utils.MonedaUtils

import static sx.contabilidad.Mapeo.*


@Slf4j
@Component
abstract class NotasDeCreditoProc implements  ProcesadorDePoliza {

    abstract String getTipo()

    abstract String getTipoLabel()

    @Override
    String definirConcepto(Poliza poliza) {
        return  " ${this.getTipoLabel()}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {

        poliza.partidas.clear()
        String select = getSelect().replaceAll('@FECHA', toSqlDate(poliza.fecha))
        // log.info('Select: {}', select)
        List rows = getAllRows(select, [])
        rows = rows.findAll {it.asiento.startsWith( this.getTipo())}
        log.info('Procesando poliza {}  {} registros', poliza.tipo, poliza.subtipo)

        rows.each { row ->
                cargoNotas(poliza,row)
                abonoIvaNoTrasladado(poliza,row)
                if(row.partidas_idx == row.max)
                    abonoCliente(poliza,row)
                
        }

        registrarVariacionCambiaria(poliza)

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
                if(row.cliente == '402880fc5e4ec411015e4ec7a46701de') { // PAPELSA BAJIO
                    ctaSegundo = '-0004-'
                }
                break
        }

        def ctaTercero = ''

        def sucursal = Sucursal.findByNombre(row.sucursal).clave
        if( new Integer(sucursal).intValue() < 10){
            ctaTercero = "000" + sucursal
        }else{
            ctaTercero = "00" + sucursal
        }
        


        CuentaContable cuenta = buscarCuenta(ctaPrimero+ctaSegundo+ctaTercero+"-0000")

        if(!cuenta)
            throw new RuntimeException("No existe cuenta contable para el cargo a notas del reg: ${row}")
        def tc = row.tc
        BigDecimal subtotal = MonedaUtils.round(row.subtotal * tc, 2)
        def stc = ''

        if(tc) {
            stc = " T.C: ${tc}"
        }
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "NC: ${row.folio} F:${row.documento} ${row.fecha_documento.format('dd/MM/yyyy')}  ${row.documentoTipo} ${row.sucursal} ${stc}"


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
                debe: subtotal
        )
        asignarComprobanteNacional(det, row,)
        poliza.addToPartidas(det)

    }


    def abonoIvaNoTrasladado(Poliza poliza, def row) {
        String clave = "209-0001-0000-0000"
        CuentaContable cuenta = buscarCuenta(clave)
        def tc = row.tc_iva_fac
        BigDecimal iva = MonedaUtils.round(row.impuesto * tc, 2)
        def stc = ''

        if(tc) {
            stc = " T.C: ${tc}"
        }
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "NC: ${row.folio} F:${row.documento} ${row.fecha_documento.format('dd/MM/yyyy')} " +
                        "${row.documentoTipo} ${row.sucursal} ${stc}"
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
                debe: iva
        )
        asignarComprobanteNacional(det, row,)
        poliza.addToPartidas(det)
    }

    def abonoCliente(Poliza poliza, def row){
        
        if(row.cta_cliente == null) {
            throw new RuntimeException("No existe cuenta para el cliente:  ${row.cliente}")
        }

        CuentaContable cuenta = buscarCuenta(row.cta_cliente)
        def tc = row.tc_var
        BigDecimal total = MonedaUtils.round(row.total * tc, 2)
        def stc = ''

        if(tc) {
            stc = " T.C: ${tc}"
        }
        String descripcion  = !row.origen ?
                "${row.asiento}":
                "NC: ${row.folio} F:${row.documento} ${row.fecha_documento.format('dd/MM/yyyy')} ${row.documentoTipo} ${row.sucursal} ${stc}"
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
            haber: total,
            debe: 0.0
        )
        asignarComprobanteNacional(det, row,)
        poliza.addToPartidas(det)
    }

    def registrarVariacionCambiaria(Poliza p) {

        def grupos = p.partidas.findAll {it.moneda == 'USD' }
        .groupBy { it.origen }

        grupos.each {
            BigDecimal debe = it.value.sum 0.0, {r -> r.debe}
            BigDecimal haber = it.value.sum 0.0, {r -> r.haber}

            BigDecimal dif = debe - haber
            if(dif.abs() > 0.01 ){
                log.info("Registrando variacion cambiaria: ${it.key} Debe: ${debe} Haber: ${haber} Dif: ${dif}")

                def det = it.value.find {it.cuenta.clave.startsWith('105')}

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

    void asignarComprobanteNacional(PolizaDet det, def row) {
        det.uuid = row.uuid
        det.rfc = row.rfc
        det.montoTotal = row.montoTotal
        det.moneda = row.moneda
        det.tipCamb = row.tc
    }

    String getSelect() {
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
        x.tc_iva_fac,
        x.folio,
        x.total,
        x.total as montoTotal,        
        x.documentoTipo,
        x.asiento,
        x.referencia2,
        x.origen,
        x.cliente,
        x.cta_cliente,
        x.partidas_idx,
        x.max,
        x.rfc,
        x.uuid,
        CASE WHEN MONTH('@FECHA')=MONTH(x.fecha_documento)  and x.moneda='USD' then (SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD(x.FECHA_documento, INTERVAL -1 DAY) )
        WHEN MONTH('@FECHA')<>MONTH(x.fecha_documento) and x.moneda='USD' then (SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD( CONCAT(YEAR('@FECHA'),'/',MONTH('@FECHA'),'/',01) , INTERVAL -2 DAY) ) else 1.00 end as tc_var
        FROM (                
          SELECT d.base subtotal ,d.impuesto,d.importe total_det,d.fecha_documento,d.documento,d.sucursal,f.fecha,f.moneda,f.tipo_de_cambio  tc,y.tipo_de_cambio tc_iva_fac,n.folio,n.total ,f.tipo as documentoTipo,
		concat('NOTA_',substr(f.forma_de_pago,1,3),'_',f.tipo) as asiento,c.nombre referencia2,n.id as origen,f.cliente_id as cliente,
		concat((case when f.tipo='CRE' then concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=c.id ))
				when f.tipo='CON' then (case when s.clave>9 then concat('105-0001-00',s.clave) else concat('105-0001-000',s.clave) end)
				when f.tipo='COD' then (case when s.clave>9 then concat('105-0002-00',s.clave) else concat('105-0002-000',s.clave) end)
				else 'no_cta' end),'-0000') as cta_cliente,d.partidas_idx,(select max(partidas_idx) from nota_de_credito_det y  where y.nota_id=n.id) as max, c.rfc, x.uuid
		FROM cobro f join cliente c on(f.cliente_id=c.id)  
		join nota_de_credito n on(f.id=n.cobro_id) left join nota_de_credito_det d on(d.nota_id=n.id)  join sucursal s on(d.sucursal=s.nombre)
		join cfdi x on(n.cfdi_id=x.id)  join cuenta_por_cobrar y on(d.cuenta_por_cobrar_id=y.id)
		where  n.fecha = '@FECHA' and F.forma_de_pago in('BONIFICACION') and n.sw2 is null and (x.cancelado is false or x.cancelado is null)		
		union
		SELECT n.importe subtotal ,n.impuesto,n.total,y.fecha as fecha_documento,y.documento,s.nombre as sucursal ,f.fecha,f.moneda,f.tipo_de_cambio  tc,y.tipo_de_cambio tc_iva_fac,n.folio,n.total,f.tipo as documentoTipo,
		concat('NOTA_',substr(f.forma_de_pago,1,3),'_',f.tipo) as asiento,c.nombre referencia2,n.id as origen ,f.cliente_id as cliente,
		concat((case when f.tipo='CRE' then concat('105-',(SELECT concat(case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end) FROM cuenta_operativa_cliente x where x.cliente_id=c.id ))  
				when f.tipo='CON' then (case when s.clave>9 then concat('105-0001-00',s.clave) else concat('105-0001-000',s.clave) end)
				when f.tipo='COD' then (case when s.clave>9 then concat('105-0002-00',s.clave) else concat('105-0002-000',s.clave) end)
				else 'no_cta' end),'-0000') as cta_cliente,0,0, c.rfc, x.uuid
		FROM cobro f join cliente c on(f.cliente_id=c.id)  join sucursal s on(f.sucursal_id=s.id) join nota_de_credito n on(f.id=n.cobro_id) 
		join cfdi x on(n.cfdi_id=x.id)  join devolucion_de_venta d on(d.cobro_id=f.id)  join venta v on(d.venta_id=v.id) join cuenta_por_cobrar y on(v.cuenta_por_cobrar_id=y.id)
		where  n.fecha = '@FECHA' and F.forma_de_pago in('DEVOLUCION') and n.sw2 is null and (x.cancelado is false or x.cancelado is null)  		                      
        ) as x order by x.documentoTipo,x.folio
        """
        return QUERY
    }

}
