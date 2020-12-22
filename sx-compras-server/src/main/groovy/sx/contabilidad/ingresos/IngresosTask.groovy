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
import sx.cxc.NotaDeCredito
import sx.cxc.Cobro

@Slf4j
@Component
class IngresosTask implements  AsientoBuilder {


    @Override
    def generarAsientos(Poliza poliza, Map params = [:]) {
        log.info("Generando asientos contables para Ingresos {} {}", poliza.fecha)

        asientoBancos(poliza, params)
        // asientoNotas(poliza, params)
        asientoClientes(poliza, params)
        asientoSaf(poliza, params)
 
    }

    def asientoBancos(Poliza poliza, Map params = [:]){

        String tipo = params.tipo
        
        def tipoStr = "(m.tipo='CON' OR m.forma_de_pago like '%TARJETA%')" 

        if(tipo != 'CON'){
          tipoStr = " m.tipo ='${tipo}' and m.forma_de_pago not like '%TARJETA%'"
        }

        String sql = getIngresosSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))
                .replaceAll("@TIPO", tipoStr)

        // println sql

        List rows = getAllRows(sql, [])

        rows.each{row ->

            String descripcion = "${row.referencia2} FOLIO: ${row.documento}"

             if (row.referencia == 'AMEX_INGRESO') {
                
                PolizaDet detAmexCargo = mapRow(row.cta_amex.toString(), descripcion, row)
                detAmexCargo.debe = row.total.abs()
                poliza.addToPartidas(detAmexCargo)

                PolizaDet detAmexAbono = mapRow(row.cta_amex.toString(), descripcion, row)
                detAmexAbono.haber = row.total.abs()
                poliza.addToPartidas(detAmexAbono)
            } 
      
            // Cargo A Bancos
            if(row.referencia.endsWith('COMISION')){
                PolizaDet detGasto = mapRow(row.cta_comision, descripcion, row, row.total)
                poliza.addToPartidas(detGasto)
                if(!row.referencia.contains('AMEX')) {
                    PolizaDet det = mapRow(row.cta_contable, descripcion, row,0.00, row.total)
                    poliza.addToPartidas(det)
                }
            }else if(row.referencia.endsWith('IVA')){
                PolizaDet detIva = mapRow(row.cta_comision_iva, descripcion, row, row.total)
                poliza.addToPartidas(detIva)
                if(!row.referencia.contains('AMEX')) {
                    PolizaDet det = mapRow(row.cta_contable, descripcion, row, 0.00, row.total)
                    poliza.addToPartidas(det)
                }
            }else{

                def subTotal = MonedaUtils.calcularImporteDelTotal(row.total)   
                def totalBco = row.referencia.contains('AMEX') ? row.banco_amex : row.asiento.toString().contains('xIDENT') ?  subTotal : row.total
                
                PolizaDet det = mapRow(row.cta_contable, descripcion, row, totalBco)

                if(row.moneda == 'USD'){
                    det.asiento = "${det.asiento}_USD"
                    det.descripcion = "${det.descripcion} tc:${row.tc}"
                }

                poliza.addToPartidas(det)
            }
            
            
            if(row.asiento.toString().contains('xIDENT')) {   
                def iva = row.total - MonedaUtils.calcularImporteDelTotal(row.total) 
                def ctaxiden = ''
                if(tipo == 'CON') {
                    ctaxiden =  '208-0001-0000-0000'
                }else{
                    ctaxiden =  '209-0001-0000-0000'
                }
                poliza.addToPartidas(mapRow(ctaxiden,descripcion, row,iva))
            } 


            if(row.diferenciaFicha > 0.0) {
                
                row.cliete = row.diferenciaTipo
                row.cliente = row.diferenciaTipo
                poliza.addToPartidas(mapRow(
                        row.cta_cajera,
                        descripcion,
                        row,
                        0.0,
                        row.diferenciaFicha))
            }else if(row.diferenciaFicha < 0.0) {
                    
                row.cliete = row.diferenciaTipo
                row.cliente = row.diferenciaTipo
                poliza.addToPartidas(mapRow(
                        row.cta_cajera,
                        descripcion,
                        row,
                        row.diferenciaFicha))
            }


        }

    }

    def asientoNotas(Poliza poliza, Map params = [:]) {
        String tipo = params.tipo
        String sqlNotas = getNotasSql()
                        .replaceAll('@FECHA',toSqlDate(poliza.fecha))
                        .replaceAll('@TIPO',tipo)

        List rowsNotas = getAllRows(sqlNotas, [])

        rowsNotas.each{row ->
            def ctaIva = '209-0001-0000-0000'
            String descripcion = "NOTA: ${row.folio} ${row.documentoTipo} ${row.fecha} "
            poliza.addToPartidas(mapRow(row.cta_nota, descripcion, row, (row.subtotal * row.tc)))
            if(row.documentoTipo == 'CON'){
                ctaIva = '208-0001-0000-0000'
            }
            poliza.addToPartidas(mapRow(ctaIva, descripcion, row, (row.impuesto * row.tc)))
        }
    }

    def asientoClientes(Poliza poliza, Map params = [:]){
        String tipo = params.tipo

        def tipoStr = "  (b.tipo='${tipo}' OR (b.tipo in('COD','ACF','OTR') and (b.forma_de_pago like 'EFECTIVO%' or b.forma_de_pago like '%TARJETA%')) or (b.tipo in('CRE','CHE','JUR') AND b.forma_de_pago like '%TARJETA%'))" 

        if(tipo == 'COD'){
            tipoStr = "  ( ( b.tipo in('${tipo}','ACF','OTR') and (b.forma_de_pago not like 'EFECTIVO%' and b.forma_de_pago not like '%TARJETA%') ) )" 
        }

         if(tipo == 'CRE' || tipo == 'CHE' || tipo == 'JUR' ){
            tipoStr = "  b.tipo ='${tipo}' "      
        }


        String sqlClientes = getClientesSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))
                .replaceAll("@TIPO", tipoStr)
                .replace("@OTRO",tipo)

           println sqlClientes
    
        List rowsClientes = getAllRows(sqlClientes, [])
         
        rowsClientes.each{row ->

            def tcCre = row.moneda == 'USD' ? "tc:${row.tc}" : ''

            def cobro = Cobro.get(row.cobroId)

             String descripcion = "Doc: ${row.documento} ${row.fecha_fac} ${row.sucursal} ${tcCre} "

            if (row.asiento.toString().contains('NOTA')) {
                def nota = NotaDeCredito.findByCobro(cobro)
                if(tipo == 'CON' || tipo == 'COD'){
                    descripcion = "NOTA: ${nota.folio}  ${nota.fecha}"
                }else{
                    descripcion = "Doc: ${row.documento} ${row.fecha_fac} ${row.sucursal} ${tcCre} Nota: ${nota.folio} "
                }
            }
            

            if((tipo == 'CON' || tipo == 'COD') && !row.asiento.toString().contains('NOTA') ){ 
                descripcion = "COBRANZA: ${row.documentoTipo} "
            }

            def ctaCte = row.cta_cliente

            if(tipo == 'CON' &&  row.cta_tar == '205-0007-0001-0000'){
                ctaCte = row.cta_tar
            }

            // Asiento de Cobranza Tarjetas
           
            if((tipo == 'CRE' || tipo == 'CHE' || tipo == 'JUR') &&  row.cta_tar == '205-0007-0001-0000'){
               PolizaDet tarjetaDet = mapRow(row.cta_tar, descripcion, row, row.total)
               poliza.addToPartidas(tarjetaDet)
            }

            PolizaDet clienteDet = mapRow(ctaCte, descripcion, row, 0.00, row.total)

            if(tipo == 'CON' &&  row.cta_tar == '205-0007-0001-0000'){
                clienteDet.sucursal = cobro.sucursal.nombre
            }

            poliza.addToPartidas(clienteDet)
            
              if(row.asiento.endsWith('APL')){
                def cta =  '205-0001-0004-0000'


                println "Cobro Saf Cliente: "+ cobro.cliente.nombre

                BigDecimal importeDiv = MonedaUtils.calcularImporteDelTotal(row.total)
                BigDecimal ivaDiv = row.total - importeDiv
                if(row.asiento.toString().contains('NOTA')){
                    importeDiv = row.total
                }

                def detCliente = mapRow(cta, descripcion, row,importeDiv)

                detCliente.referencia2 = cobro.cliente.nombre
                poliza.addToPartidas(detCliente)
                if(row.tipo == 'CON' && !row.asiento.toString().contains('NOTA')){
                    def detIvaCon = mapRow('208-0001-0000-0000', descripcion, row,ivaDiv)
                    detIvaCon.referencia2 = cobro.cliente.nombre
                    poliza.addToPartidas(detIvaCon)
                }else if(!row.asiento.toString().contains('NOTA')){
                    def detIvaNoCon = mapRow('209-0001-0000-0000', descripcion, row,ivaDiv)
                    detIvaNoCon.referencia2 = cobro.cliente.nombre
                    poliza.addToPartidas(detIvaNoCon)
                }
                
            }

             if((row.tipo == 'COD' || row.tipo == 'CRE' || row.tipo == 'CHE') && ! row.asiento.toString().contains('xIDENT') && row.asiento != 'NOTA' && ! row.asiento.toString().contains('SAF') ){

                BigDecimal importe = MonedaUtils.calcularImporteDelTotal(row.total)
                BigDecimal iva = row.total - importe

                if (row.asiento !='NOTA') {

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
            }        
        } 

    }

    def asientoSaf(Poliza poliza, Map params = [:]){

        String tipo = params.tipo

        String sqlSaf = getSafSql()
                .replaceAll("@FECHA", toSqlDate(poliza.fecha))
                .replaceAll("@TIPO", tipo)
            
        List rowsSaf = getAllRows(sqlSaf, [])

        rowsSaf.each{row ->

            def cobro = Cobro.get(row.cobroId)
            String descripcion = "${cobro.formaDePago}"

             if(row.asiento.endsWith('_OGST')){
                PolizaDet det = mapRow(row.cta_contable, descripcion, row, row.total)
                det.referencia2 = cobro.cliente.nombre
                poliza.addToPartidas(det)
            }else if(row.asiento.endsWith('_OPRD')){
                PolizaDet det = mapRow(row.cta_contable, descripcion, row,0.00,row.total)
                det.referencia2 = cobro.cliente.nombre
                poliza.addToPartidas(det)
            }else{

                BigDecimal importe = MonedaUtils.calcularImporteDelTotal(row.total)
                BigDecimal iva = row.total - importe

                def ctaIva = '208-0001-0000-0000'

                PolizaDet det = new PolizaDet()
                if(row.asiento.toString().contains('NOTA')){
                    def nota = NotaDeCredito.findByCobro(cobro)
                    descripcion = "NOTA: ${nota.folio} ${tipo} ${nota.fecha} "
                    ctaIva = '209-0001-0000-0000'
                    det.asiento = "NOTA_${(row.forma_de_pago).take(3)}_${tipo}_SAF"
                    det.referencia2 = cobro.cliente.nombre
                    det = mapRow(row.cta_contable, descripcion, row, 0.00, row.total)
                    poliza.addToPartidas(det)
                }else{
                    det = mapRow(row.cta_contable, descripcion, row, 0.00, importe)
                    det.referencia2 = cobro.cliente.nombre
                    poliza.addToPartidas(det)
                    PolizaDet ivaDet = mapRow(ctaIva, descripcion, row, 0.00, iva)
                    ivaDet.asiento = "${(row.forma_de_pago).take(3)}_${tipo}_SAF"
                    ivaDet.referencia2 = cobro.cliente.nombre
                    poliza.addToPartidas(ivaDet)
                }
            }



            if(row.asiento.endsWith('_OPRD_SAF')){
               
                def ctaOprd =  '205-0001-0004-0000'
                PolizaDet detSafOprd = mapRow(ctaOprd, descripcion, row, row.total)
                poliza.addToPartidas(detSafOprd)
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
                documento: row.documento,
                documentoTipo: row.documentoTipo,
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
     String getIngresosSql(){
        String select = """
        SELECT (case 	when m.forma_de_pago like 'TRANSF%' then concat('COB_TRANSF_',m.tipo,(case when m.por_identificar is true then '_xIDENT' else '' end))
        		when m.forma_de_pago like 'DEP%EFE%' then concat('COB_DEP_EFE_',m.tipo,(case when m.por_identificar is true then '_xIDENT' else '' end))
        		when m.forma_de_pago like 'DEP%CHE%' then concat('COB_DEP_CHE_',m.tipo,(case when m.por_identificar is true then '_xIDENT' else '' end))
        		when m.forma_de_pago IN('CHEQUE','EFECTIVO') then concat('COB_FICHA_',m.tipo) when m.forma_de_pago like 'TARJ%' then 'COB_TARJ_CON' else '' end) asiento, 'MovimientoDeCuenta' entidad
        	,case when m.referencia>0 then m.referencia else(case when t.id is null then SUBSTRING(m.referencia,LENGTH(SUBSTRING_INDEX(m.referencia,':',1))+3) else CONVERT (t.folio,CHAR) end) end documento,m.referencia
        ,m.id origen,(case when m.forma_de_pago like 'TARJ%' then 'CON' else m.tipo end) documentoTipo,m.fecha,m.referencia,m.moneda,m.tipo_de_cambio tc ,round(m.importe * m.tipo_de_cambio,2) total,m.forma_de_pago
        ,(
            case when m.sucursal is null 
                 then SUBSTRING(m.comentario,LENGTH(SUBSTRING_INDEX(m.comentario,(case when m.comentario like '%BANCO%' then 'BANCO' else 'EFECTIVO' end),1))+5) 
                 else m.sucursal end) sucursal, s.clave suc
        ,concat((case when m.por_identificar is true then '205-0002-' else (case when m.moneda='USD' then '102-0002-' else '102-0001-' end) end),z.sub_cuenta_operativa,'-0000') cta_contable,z.numero ctaDestino,z.descripcion cliente
        ,(case when f.diferencia <0 then concat('FALTANTE_',diferencia_tipo) when f.diferencia>0 then concat('SOBRANTE_',diferencia_tipo) else '' end)  as diferenciaTipo,ifnull(f.diferencia,0) diferenciaFicha
        ,(case when f.diferencia=0 or f.diferencia is null then '000-0000-0000-0000' else concat('107-0002-',(case when f.diferencia_usuario>99 then '0' when f.diferencia_usuario>9 then '00' else '000' end),f.diferencia_usuario,'-0000') end) cta_cajera
	    ,(case when m.forma_de_pago='TRANSFERENCIA' then ifnull((SELECT max(x.nombre) FROM cobro_transferencia d join cobro c on(d.cobro_id=c.id) join cliente x on(c.cliente_id=x.id)  where d.ingreso_id=m.id ),'PAPEL SA DE CV') 
	   	else ifnull((SELECT x.nombre FROM cobro_deposito d join cobro c on(d.cobro_id=c.id) join cliente x on(c.cliente_id=x.id)  where d.ingreso_id=m.id ),(case when m.forma_de_pago ='EFECTIVO' then 'Ficha EFECTIVO ' when m.forma_de_pago ='CHEQUE' and m.comentario like '%MIS%BAN%' then 'Ficha MISMO_BANCO ' when m.forma_de_pago ='CHEQUE' and m.comentario like '%OTR%BAN%' then 'Ficha OTRO_BANCO ' else m.referencia end)) end) referencia2
        ,(case when m.referencia like '%COMISION' then concat('600-0014-',(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') else '000-0000-0000-0000' end) cta_comision
	    ,(case when m.referencia like '%COMISION_IVA' then '118-0002-0000-0000' else '000-0000-0000-0000' end) cta_comision_iva
	    ,(case when m.referencia like '%AMEX%' then '107-0001-0001-0000' else '000-0000-0000-0000' end) cta_amex
        ,ifnull((SELECT sum(round(n.importe,2)) FROM corte_de_tarjeta_aplicacion d join corte_de_tarjeta c on(d.corte_id=c.id) join movimiento_de_cuenta n on(d.ingreso_id=n.id) where c.id=t.id and m.referencia like '%AMEX%' ),0) banco_amex
        FROM movimiento_de_cuenta m join cuenta_de_banco z on(m.cuenta_id=z.id) left join ficha f on(f.ingreso_id=m.id)  left join sucursal s on(m.sucursal=s.nombre)
        left join corte_de_tarjeta_aplicacion a on(a.ingreso_id=m.id) left join corte_de_tarjeta t on(a.corte_id=t.id)
        WHERE m.CONCEPTO='VENTAS' AND m.FECHA='@FECHA' and @TIPO
        """
        return select
    }

    String getNotasSql() {
        String sql = """
             SELECT concat('NOTA_',substr(f.forma_de_pago,1,3),'_',f.tipo) as asiento,c.nombre referencia2,n.id as origen ,f.cliente_id as cliente,n.folio,n.total,f.tipo as documentoTipo,n.fecha
            ,s.nombre as sucursal ,n.importe subtotal ,n.importe-n.total impuesto,n.total,f.moneda,f.tipo_de_cambio  tc, c.rfc, x.uuid
            ,concat((case when f.forma_de_pago='DEVOLUCION' then '402-' else '403-' end)
          		,(case when f.tipo='CON' then '0001-' when f.tipo in('COD','OTR','ACF') then '0002-' when c.clave='P010389'  then '0004-' when f.tipo='CRE' then '0003-' else 'nd' end )
		        ,(case when s.clave>9 then '00' else '000' end),s.clave,'-0000') cta_nota          
            ,null entidad,null documento
            FROM cobro f join cliente c on(f.cliente_id=c.id)  join sucursal s on(f.sucursal_id=s.id) join nota_de_credito n on(f.id=n.cobro_id) join cfdi x on(n.cfdi_id=x.id)
            where  n.sw2 is null and (x.cancelado is false or x.cancelado is null) and date(f.primera_aplicacion)='@FECHA' and f.tipo='@TIPO'
        """
        return sql
    }

    String getClientesSql(){
        String sql ="""
            SELECT
            cobroId, 
            ifnull((case when a.moneda='USD' then concat(a.asiento,'_USD') else a.asiento end),"COB") asiento,a.documentoTipo,a.referencia2,a.sucursal,a.suc ,a.cta_iva_pag,a.cta_iva_pend
            ,case when a.documentoTipo in('CRE','CHE','JUR') and a.asiento like '%_TAR_%' THEN '205-0007-0001-0000' else '000-0000-0000-0000' end cta_tar
            ,a.cta_cliente,a.moneda,a.tc,sum(a.subtotal) subtotal,sum(a.impuesto) impuesto,sum(a.total) total,a.fecha,a.forma_de_pago,a.referencia,a.origen,'CuentaPorCobrar' entidad,a.documento,a.fecha_fac,a.total cobro_aplic, '@OTRO' tipo
        	  FROM (        	      	  
            SELECT 
            b.id as cobroId,
	        (case when f.tipo in('CON','COD') then null else f.id end) origen,a.id aplic_id,concat((case when b.forma_de_pago in('BONIFICACION','DEVOLUCION') then 'NOTA' else 'COB' end)
            ,(case when b.forma_de_pago not like 'TARJ%' then '' else (SELECT case when t.visa_master is false then '_TAR_AMEX' when t.debito_credito is false then '_TAR_CRED' else '_TAR_DEBT' end FROM cobro_tarjeta t where t.cobro_id=b.id) end)
            ,(case when b.forma_de_pago ='PAGO_DIF' then '_OGST' when b.forma_de_pago ='EFECTIVO' then '_FICHA_EFE' when b.forma_de_pago ='CHEQUE' then '_FICHA_CHE' when b.forma_de_pago like 'DEP%' then 
            		(SELECT case when m.por_identificar is true then '_DEP_xIDENT' else '_DEP' end FROM cobro_deposito d  join movimiento_de_cuenta m on(d.ingreso_id=m.id) where d.cobro_id=b.id)   
            		when b.forma_de_pago like 'TRANSF%' then 
            		(SELECT case when m.por_identificar is true then '_TRANSF_xIDENT' else '_TRANSF' end FROM cobro_transferencia d  join movimiento_de_cuenta m on(d.ingreso_id=m.id) where d.cobro_id=b.id)   
            		else '' end)  ) as asiento
            ,f.tipo as documentoTipo,a.fecha,(case when f.tipo in('CON','COD') or b.forma_De_pago like 'TARJ%' then null else f.documento end) documento,(case when f.tipo in('CON','COD') then null else f.fecha end) fecha_fac,b.forma_de_pago,b.referencia
            ,f.moneda,f.tipo_de_cambio tc,round((a.importe*b.tipo_de_cambio)/1.16,2) subtotal,round(a.importe*b.tipo_de_cambio,2) - round((a.importe*b.tipo_de_cambio)/1.16,2) impuesto,round(a.importe*b.tipo_de_cambio,2) total
            ,(case when f.tipo in('CON','COD') then concat('VENTA ',f.tipo,' ',s.nombre) else (select c.nombre from cliente c where f.cliente_id=c.id) end) referencia2,s.nombre sucursal, s.clave as suc
			 ,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente_id,'208-0001-0000-0000' cta_iva_pag,'209-0001-0000-0000' cta_iva_pend 
            ,concat(
                (case when b.tipo in('CHE','JUR') then '106-' else '105-' end),
                (case 
                    when b.tipo = 'CRE' then 
                        (SELECT case when x.cuenta_operativa='0266' then concat('0004-',x.cuenta_operativa) else concat('0003-',x.cuenta_operativa) end FROM cuenta_operativa_cliente x where x.cliente_id=f.cliente_id )
                    when b.tipo = 'CHE' then 
                        (SELECT concat('0001-',x.cuenta_operativa)FROM cuenta_operativa_cliente x where x.cliente_id=f.cliente_id)
                    when b.tipo = 'JUR' then 
                        (SELECT concat('0002-',x.cuenta_operativa)FROM cuenta_operativa_cliente x where x.cliente_id=f.cliente_id)
                    else 
                    concat(
                            (case when b.tipo='CON' then '0001-' when b.tipo in('COD','OTR','ACF') then '0002-' else 'nd' end )
                            ,(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end)
                        )
                    end)
            	,'-0000') as cta_cliente    
            FROM aplicacion_de_cobro a join cobro b on(a.cobro_id=b.id) join cuenta_por_cobrar f on(a.cuenta_por_cobrar_id=f.id) 
            join sucursal s on(b.sucursal_id=s.id) 
            where a.fecha='@FECHA' and a.fecha=date(b.primera_aplicacion) and f.cancelada is null and  b.forma_de_pago not in('BONIFICACION','DEVOLUCION')  and @TIPO
            union
            SELECT 
            b.id as cobroId,
            (case when f.tipo in('CON','COD') then null else f.id end) origen,a.id aplic_id,concat((case when b.forma_de_pago in('BONIFICACION','DEVOLUCION') then 'NOTA' else 'COB' end)
            ,(case when b.forma_de_pago not like 'TARJ%' then '' else (SELECT case when t.visa_master is false then '_TAR_AMEX' when t.debito_credito is false then '_TAR_CRED' else '_TAR_DEBT' end FROM cobro_tarjeta t where t.cobro_id=b.id) end)
            ,(case when b.forma_de_pago ='PAGO_DIF' then '_OGST' when b.forma_de_pago ='EFECTIVO' then '_FICHA_EFE' when b.forma_de_pago ='CHEQUE' then '_FICHA_CHE' when b.forma_de_pago like 'DEP%' then 
            		(SELECT case when m.por_identificar is true then '_DEP_xIDENT' else '_DEP' end FROM cobro_deposito d join movimiento_de_cuenta m on(d.ingreso_id=m.id) where d.cobro_id=b.id)   
            		when b.forma_de_pago like 'TRANSF%' then 
            		(SELECT case when m.por_identificar is true then '_TRANSF_xIDENT' else '_TRANSF' end FROM cobro_transferencia d join movimiento_de_cuenta m on(d.ingreso_id=m.id) where d.cobro_id=b.id)   
            		else '' end),'_SAF_APL') as asiento
            ,f.tipo as documentoTipo,a.fecha,(case when f.tipo in('CON','COD') or b.forma_De_pago like 'TARJ%' then null else f.documento end) documento,(case when f.tipo in('CON','COD') then null else f.fecha end) fecha_fac,b.forma_de_pago,b.referencia
            ,f.moneda,f.tipo_de_cambio tc,round((a.importe*b.tipo_de_cambio)/1.16,2) subtotal,round(a.importe*b.tipo_de_cambio,2) - round((a.importe*b.tipo_de_cambio)/1.16,2) impuesto,round(a.importe*b.tipo_de_cambio,2) total
            ,(case when f.tipo in('CON','COD') then concat('VENTA ',f.tipo,' ',s.nombre) else (select c.nombre from cliente c where f.cliente_id=c.id) end) referencia2,s.nombre sucursal, s.clave as suc
			,concat(s.nombre,"_",f.tipo_documento,"_",f.tipo) cliente_id,'208-0001-0000-0000' cta_iva_pag,'209-0001-0000-0000' cta_iva_pend
            ,concat(
                (case when b.tipo in('CHE','JUR') then '106-' else '105-' end)
                ,(case 
                when b.tipo = 'CRE' then 
                    (SELECT 
                            case 
                            when x.cuenta_operativa='0266' 
                            then 
                                concat
                                    ('0004-',x.cuenta_operativa)
                            else 
                                concat
                                ('0003-',x.cuenta_operativa)
                            end
                    FROM cuenta_operativa_cliente x where x.cliente_id=f.cliente_id )
                when b.tipo = 'CHE' then 
                    (SELECT 
                                concat
                                ('0001-',x.cuenta_operativa)
						
                    FROM cuenta_operativa_cliente x where x.cliente_id=f.cliente_id 
                    )
                when b.tipo = 'JUR' then 
                    (SELECT 
                                concat
                                ('0002-',x.cuenta_operativa)
						
                    FROM cuenta_operativa_cliente x where x.cliente_id=f.cliente_id 
                    )
            	else 
                    concat(
                        (case when b.tipo='CON' then '0001-' when b.tipo in('COD','OTR','ACF') then '0002-' else 'nd' end )
                        ,(case when s.clave>9 then concat('00',s.clave) else concat('000',s.clave) end)
                    )
                end)
            	,'-0000'
            ) as cta_cliente
            FROM aplicacion_de_cobro a join cobro b on(a.cobro_id=b.id) join cuenta_por_cobrar f on(a.cuenta_por_cobrar_id=f.id) 
            join sucursal s on(b.sucursal_id=s.id) 
            where a.fecha='@FECHA' and a.fecha>date(b.primera_aplicacion) and f.cancelada is null and  b.forma_de_pago not in('BONIFICACION','DEVOLUCION') and  @TIPO
            ) as a
            group by a.asiento,a.documentoTipo,a.documento,a.referencia2,a.moneda,a.tc,a.sucursal,a.suc
        """ 
        return sql

    } 

    String getSafSql(){
        String sql ="""
            select cobroId,forma_de_pago, z.asiento,z.sucursal,sum(z.total) total,cta_contable,concat('COB_VENTA ',z.tipo,' ',z.sucursal) referencia2,z.fecha,null origen,null entidad,null documento,null documentoTipo  
            from (         	  
            select x.id as cobroId,concat((case when x.forma_de_pago in('BONIFICACION','DEVOLUCION') then 'NOTA_' else 'COB_' end),'VENTAS_',x.tipo,'_SAF') as asiento,x.id,x.tipo,x.forma_de_pago,x.referencia,date(primera_aplicacion) fecha,s.nombre sucursal,(x.importe-(case when x.diferencia_fecha='@FECHA' then x.diferencia else 0 end) - ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=x.id and a.fecha='@FECHA'),0) ) total
            ,'205-0001-0004-0000' cta_contable
            from cobro x join aplicacion_de_cobro y on(y.cobro_id=x.id) join sucursal s on(x.sucursal_id=s.id) where x.tipo='@TIPO' and date(x.primera_aplicacion)='@FECHA' and  x.forma_de_pago not in('BONIFICACION','DEVOLUCION') and
            (x.importe-(case when x.diferencia_fecha='@FECHA' then x.diferencia else 0 end) - ifnull((SELECT sum(a.importe) FROM aplicacion_de_cobro a where a.cobro_id=x.id and a.fecha='@FECHA'),0) )>0 	group by x.id 
            union
            select  x.id as cobroId,concat((case when x.forma_de_pago in('BONIFICACION','DEVOLUCION') then 'NOTA_' else 'COB_' end),'VENTAS_',x.tipo,'_OPRD') as asiento,x.id,x.tipo,x.forma_de_pago,x.referencia,x.diferencia_fecha fecha,s.nombre sucursal,x.diferencia total,'704-0005-0000-0000' cta_contable
            from cobro x  join sucursal s on(x.sucursal_id=s.id) where x.tipo='@TIPO' and x.diferencia_fecha='@FECHA' and date(x.primera_aplicacion)='@FECHA' and  x.forma_de_pago not in('BONIFICACION','DEVOLUCION')
            union
            select x.id as cobroId,concat((case when x.forma_de_pago in('BONIFICACION','DEVOLUCION') then 'NOTA_' else 'COB_' end),'VENTAS_',x.tipo,'_OPRD_SAF') as asiento,x.id,x.tipo,x.forma_de_pago,x.referencia,x.diferencia_fecha fecha,s.nombre sucursal,x.diferencia total,'704-0005-0000-0000' cta_contable
            from cobro x  join sucursal s on(x.sucursal_id=s.id) where x.tipo='@TIPO' and x.diferencia_fecha='@FECHA' and date(x.primera_aplicacion)<>'@FECHA' and  x.forma_de_pago not in('BONIFICACION','DEVOLUCION')
            union
            select x.id as cobroId,concat((case when x.forma_de_pago in('BONIFICACION','DEVOLUCION') then 'NOTA_' else 'COB_' end),'VENTAS_',x.tipo,'_OGST') as asiento,x.id,x.tipo,x.forma_de_pago,x.referencia,date(x.primera_aplicacion) fecha,s.nombre sucursal,x.importe total
            ,'703-0001-0000-0000' cta_contable
            from cobro x  join sucursal s on(x.sucursal_id=s.id) where x.tipo='@TIPO' and date(x.primera_aplicacion)='@FECHA' and x.forma_de_pago='PAGO_DIF' 
            ) as z group by z.asiento,z.sucursal
        """
        return sql
    }

}
