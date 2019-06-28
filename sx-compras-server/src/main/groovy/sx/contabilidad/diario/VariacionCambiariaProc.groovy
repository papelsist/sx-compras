package sx.contabilidad.diario

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component

import sx.contabilidad.*
import sx.tesoreria.MovimientoDeCuenta
import sx.tesoreria.PagoDeNomina

import java.sql.SQLException

@Slf4j
@Component
class VariacionCambiariaProc implements ProcesadorMultipleDePolizas {

    //@Autowired
    //@Qualifier('inventariosProcGeneralesTask')

/*
    @Override
    String definirConcepto(Poliza poliza) {
        return "VARIACION CAMBIARIA  ${poliza.fecha.format('dd/MM/yyyy')}"
    }
*/
    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    
    def generarAsientos(Poliza poliza, Map params) {
        if (poliza.egreso == 'PROVEEDORES') {
             procesarCargoProveedor(poliza)
        }
        if (poliza.egreso == 'CLIENTES'){
            procesarCargoCuentaPorCobrar(poliza)
        }

        if (poliza.egreso == 'BANCOS') {
            procesarBanco(poliza)
        }
       
        
    }

    def procesarCargoCuentaPorCobrar(Poliza poliza) {
        String select = getSelect('CXC').replaceAll('@FECHA', toSqlDate(poliza.fecha))

       
        List rows = getAllRows(select, [])
        
        rows.each{ row ->
            def descripcion = generarDescripcion(row)
            if(row.variacion >0){
                // 702
                poliza.addToPartidas(mapRow(poliza,row.cta_cliente.toString(),descripcion+" TC: "+row.tc_ant,row,0.0,row.variacion))
                poliza.addToPartidas(mapRow(poliza,row.cta_variacion.toString(),descripcion+" TC: "+row.tc_var,row,row.variacion))
            }else{
                poliza.addToPartidas(mapRow(poliza,row.cta_cliente.toString(),descripcion+" TC: "+row.tc_ant,0.00,row,row.variacion))
                poliza.addToPartidas(mapRow(poliza,row.cta_variacion.toString(),descripcion+" TC: "+row.tc_var,row,row.variacion))
            } 
        }
    }

    def procesarBanco(Poliza poliza) {
        CuentaContable cuenta = buscarCuenta('102-0002-0008-0000')
        String ejercicio = poliza.fecha.format('yyyy')
        String mes = poliza.fecha.format('MM')
        String ref = "VARIACION (${ejercicio}-${mes})"
        
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: 'VARIACION_CAMBIARIA',
                asiento: 'VARIACION',
                referencia: ref,
                referencia2: ref,
                origen: "${ejercicio}/${mes}",
                entidad: "",
                documento: '',
                documentoTipo: 'FAC',
                documentoFecha: null,
                sucursal: 'OFICINAS',
                debe: 1,
                haber: 0.00
        )
        poliza.addToPartidas(det)
    }


    def procesarCargoProveedor(Poliza poliza) {
        String select = getSelect('CXP').replaceAll('@FECHA', toSqlDate(poliza.fecha))
        List rows = getAllRows(select, [])
        rows.each{ row ->
        def descripcion = generarDescripcion(row)
            if(row.variacion < 0){ 
                poliza.addToPartidas(mapRow(poliza,row.cta_proveedor.toString(),descripcion+" TC: "+row.tc_ant,row,0.0,row.variacion))
                // 701
                poliza.addToPartidas(mapRow(poliza,row.cta_variacion.toString(),descripcion+" TC:701 "+row.tc_var,row,row.variacion))
            }else{
                poliza.addToPartidas(mapRow(poliza,row.cta_proveedor.toString(),descripcion+" TC: "+row.tc_ant,row,row.variacion))
                // 702
                poliza.addToPartidas(mapRow(poliza,row.cta_variacion.toString(),descripcion+" TC:702 "+row.tc_var,row,0.0,row.variacion))
            } 
        }
    }

    String generarDescripcion(Map row) {
      
        if(row.tc > 1.0) {
            return "F:${row.documento} (${row.fecha_doc})"
        }
        return "F:${row.documento} (${row.fecha_doc}) "
    }

    PolizaDet mapRow(Poliza poliza, String cuentaClave, String descripcion, Map row, def debe = 0.0, def haber = 0.0) {
        CuentaContable cuenta = buscarCuenta(cuentaClave)
        String ejercicio = poliza.fecha.format('yyyy')
        String mes = poliza.fecha.format('MM')
        String ref = "${row.asiento} (${ejercicio}-${mes})"
        //descripcion = "${row.asiento}  (${ejercicio}-${mes}) ${row.sucursal}"
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: ref,
                referencia2: ref,
                origen: "${ejercicio}/${mes}",
                entidad: "",
                documento: '',
                documentoTipo: 'FAC',
                documentoFecha: null,
                sucursal: row.sucursal,
                debe: debe.abs(),
                haber: haber.abs()
        )
        return det
    }


  @Override
    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        
        def tipos = ['PROVEEDORES','CLIENTES','BANCOS']
        List<Poliza> polizas = []

        tipos.each{ t ->
            log.info('Generando  poliza {}', t)
            Poliza p = Poliza.where{
                ejercicio == command.ejercicio &&
                mes == command.mes &&
                subtipo == command.subtipo &&
                tipo == command.tipo &&
                fecha == command.fecha &&
                egreso == t
            }.find()
            
            if(p == null) {
                p = new Poliza(command.properties)
                p.concepto = "VARIACION CAMBIARIA ${t}"
                p.sucursal = 'OFICINAS'
                p.egreso = t
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)
        }
        return polizas  
    }

    String getSelect(String tipo) {
        String sql = ""

         switch(tipo) {
             case 'UBS':
                sql = """
                 """
             break
             case 'CXP':
                sql = """
        SELECT          
        'VARIACION_CAMBIARIA_CXP' asiento,
        'CXP' documentoTipo,
        x.sucursal,
        x.proveedor,       
        x.referencia2,
        x.origen,
        x.documento,
        x.fecha_doc,
        x.total,
        x.montoTotal,
        x.moneda,        
        x.tc,
        x.tc_ant,
        x.tc_var,
        x.saldo,
        x.saldo * x.tc_ant importe_ant_mxn,
        x.saldo * x.tc_var importe_var_mxn,
        round((x.saldo*x.tc_ant) - (x.saldo*x.tc_var),2) variacion,
        concat('201-0003-',x.cta_operativa_prov,'-0000') cta_proveedor,
        (case when (x.saldo*x.tc_ant) - (x.saldo*x.tc_var)<0 then  '701-0001-0000-0000' else '702-0004-0000-0000' end) cta_variacion,
        x.uuid,
        x.rfc
        FROM (
        SELECT c.id origen,P.id AS proveedor,P.nombre referencia2,'OFICINAS' AS sucursal
        ,concat(ifnull(c.serie,''),(case when c.serie is null or c.folio is null then '' else '-' end),ifnull(C.folio,'')) documento,C.fecha fecha_doc
        ,C.moneda,C.tipo_de_cambio tc
        ,CASE WHEN MONTH('@FECHA')=MONTH(c.fecha)  and c.moneda='USD' then C.tipo_de_cambio
        		WHEN MONTH('@FECHA')<>MONTH(c.fecha) and c.moneda='USD' then (SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD( CONCAT(YEAR('@FECHA'),'/',MONTH('@FECHA'),'/',01) , INTERVAL -2 DAY) ) 
        		else 1.00 end as tc_ant
        ,(SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD('@FECHA', INTERVAL -1 DAY))  tc_var
        ,c.total as montoTotal,round(c.total*c.tipo_de_cambio,2) AS total               
        ,(SELECT x.cuenta_operativa FROM cuenta_operativa_proveedor x where x.proveedor_id=p.id ) as cta_operativa_prov,c.uuid,p.rfc
        ,c.total - ifnull((SELECT d.diferencia FROM cuenta_por_pagar d where d.id=c.id and d.diferencia_fecha <='@FECHA'),0.0)
        	- ifnull((SELECT d.apagar FROM requisicion_det d join requisicion r on(d.requisicion_id=r.id) where d.cxp_id=c.id and r.fecha_de_pago<='@FECHA'),0.0)
        	- ifnull((SELECT sum(d.importe) FROM aplicacion_de_pago d where d.cxp_id=c.id and d.fecha<='@FECHA'),0.0) as saldo
        FROM cuenta_por_pagar C  JOIN proveedor p on(c.proveedor_id=p.id)         
        WHERE  C.FECHA <= '@FECHA' AND C.MONEDA='USD'    and
        (c.total - ifnull((SELECT d.diferencia FROM cuenta_por_pagar d where d.id=c.id and d.diferencia_fecha <='@FECHA'),0.0)
        - ifnull((SELECT d.apagar FROM requisicion_det d join requisicion r on(d.requisicion_id=r.id) where d.cxp_id=c.id and r.fecha_de_pago<='@FECHA'),0.0)
        - ifnull((SELECT sum(d.importe) FROM aplicacion_de_pago d where d.cxp_id=c.id and d.fecha<='@FECHA'),0.0)  ) > 10  
        GROUP BY P.ID,C.ID,C.FECHA,C.MONEDA
        ORDER BY p.nombre,c.folio
        ) as x 
        """
             break
             case 'CXC':
                sql = """
                SELECT          
                'VARIACION_CAMBIARIA_CXC' asiento,
                'VENTA' documentoTipo,
                x.sucursal,
                x.proveedor,       
                x.referencia2,
                x.origen,
                x.tipo,
                x.documento,
                x.fecha_doc,
                x.total,
                x.montoTotal,
                x.moneda,        
                x.tc,
                x.tc_ant,
                x.tc_var,
                x.saldo,
                x.saldo * x.tc_ant importe_ant_mxn,
                x.saldo * x.tc_var importe_var_mxn,
                round((x.saldo*x.tc_ant) - (x.saldo*x.tc_var),2) variacion,
                concat('105-0005-',x.cta_operativa_cte,'-0000') cta_cliente,
                (case when (x.saldo*x.tc_ant) - (x.saldo*x.tc_var)>0 then  '701-0001-0000-0000' else '702-0004-0000-0000' end) cta_variacion,
                x.uuid,
                x.rfc
                FROM (
                select c.id origen,P.id AS proveedor,P.nombre referencia2,(SELECT s.nombre FROM sucursal s where s.id=c.sucursal_id) AS sucursal
                ,c.tipo,c.documento,C.fecha fecha_doc,C.moneda,C.tipo_de_cambio tc
                ,CASE WHEN MONTH('@FECHA')=MONTH(c.fecha)  and c.moneda='USD' then C.tipo_de_cambio
                        WHEN MONTH('@FECHA')<>MONTH(c.fecha) and c.moneda='USD' then (SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD( CONCAT(YEAR('@FECHA'),'/',MONTH('@FECHA'),'/',01) , INTERVAL -2 DAY) ) 
                        else 1.00 end as tc_ant
                ,(SELECT t.tipo_de_cambio FROM tipo_de_cambio t where t.fecha=DATE_ADD('@FECHA', INTERVAL -1 DAY))  tc_var
                ,c.total as montoTotal,round(c.total*c.tipo_de_cambio,2) AS total               
                ,(SELECT x.cuenta_operativa FROM cuenta_operativa_cliente x where x.cliente_id=p.id ) as cta_operativa_cte,c.uuid,p.rfc	        
                ,c.total - ifnull((SELECT sum(d.importe) FROM aplicacion_de_cobro d where d.cuenta_por_cobrar_id=c.id and d.fecha<='@FECHA'),0.0) saldo
                FROM cuenta_por_cobrar C  JOIN cliente p on(c.cliente_id=p.id)         
                WHERE  C.FECHA <= '@FECHA' AND C.MONEDA='USD'      
                and c.total - ifnull((SELECT sum(d.importe) FROM aplicacion_de_cobro d where d.cuenta_por_cobrar_id=c.id and d.fecha<='@FECHA'),0.0)  > 10                  
                ORDER BY p.nombre,c.documento        
                ) as x
                """
             break
             default:
                 
             break
         }
        return sql
    }


}
