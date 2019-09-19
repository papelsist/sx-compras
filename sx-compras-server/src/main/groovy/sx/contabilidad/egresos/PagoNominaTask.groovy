package sx.contabilidad.egresos

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.stereotype.Component
import sx.contabilidad.AsientoBuilder
import sx.contabilidad.CuentaContable
import sx.contabilidad.Poliza
import sx.contabilidad.PolizaDet
import sx.core.Empresa
import sx.tesoreria.MovimientoDeCuenta
import sx.tesoreria.PagoDeNomina

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils

import java.sql.SQLException

@Slf4j
@Component
class PagoNominaTask implements  AsientoBuilder, EgresoTask {

    /**
     * Genera los asientos requreidos por la poliza
     *
     * @param poliza
     * @param params
     * @return
     */
    @Override
    @CompileDynamic
    def generarAsientos(Poliza poliza, Map params = [:]) {
        PagoDeNomina nomina = findPago(poliza)
        log.info("Pago de Nomina: {} {}", nomina.folio, nomina.egreso)

        if(nomina.empleado != 'PAPEL, SA DE CV'){
         
            cargoNominasPorPagar(poliza, nomina)
        }

        if(nomina.formaDePago == 'CHEQUE' && !nomina.pensionAlimenticia){
            nominaCheque(poliza, nomina)
        }

        if(nomina.empleado == 'PAPEL, SA DE CV'){
            def id = " n.id = ${nomina.nomina}"
            cargoAbonoNomina(poliza, nomina, id )
        }
        abonoBanco(poliza, nomina)
    }

    /**
     * Genera n cargos a proveedor, uno por cada factura mencionada en la requisicion
     *
     * @param poliza
     * @param r
     */

    def nominaCheque(Poliza poliza, PagoDeNomina nomina) {
        
        def query = " select ne_finiquito_id as finiquito_id, ne_liquidacion_id as liquidacion_id from finiquito where ne_finiquito_id = ? or ne_liquidacion_id = ?"
        def res = findRegistro(query,[nomina.nominaEmpleado,nomina.nominaEmpleado])


        if(res){
            if((res.finiquito_id && ! res.liquidacion_id) || (!res.finiquito_id && res.liquidacion_id)){
                def id = " ne.id = ${nomina.nominaEmpleado}"
                cargoAbonoNomina(poliza, nomina, id )
            }
            if(res.finiquito_id &&  res.liquidacion_id){
                def id = " ne.id in ( ${res.finiquito_id}, ${res.liquidacion_id})"
                cargoAbonoNomina(poliza, nomina, id )
            }
        }

        if(!res){
            def id = " ne.id = ${nomina.nominaEmpleado}"
            cargoAbonoNomina(poliza, nomina, id )
        }

        

    }

    void cargoNominasPorPagar(Poliza poliza, PagoDeNomina nomina) {
  
        log.info('Cargo a nominas por pagar {}', nomina.egreso)
        MovimientoDeCuenta egreso = nomina.egreso

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"

        Map row = [
                asiento: "${egreso.tipo}",
                referencia: nomina.afavor,
                referencia2: egreso.cuenta.descripcion,
                origen: egreso.id,
                documentoTipo: 'NOMINA',
                sucursal: 'OFICINAS'
        ]

        row.rfc = Empresa.first().rfc

        
        String cv = "210-0001-0000-0000"

        
        if(nomina.pensionAlimenticia) {
         
            // poliza.concepto = poliza.concepto + " PA"
            MovimientoDeCuenta mov = nomina.egreso
            poliza.concepto = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${mov.referencia} ${mov.afavor} (${mov.fecha.format('dd/MM/yyyy')})" +
                    " (${mov.tipo} ${mov.tipo != mov.concepto ? mov.concepto : ''}) PA"
            cv = "205-D007-${nomina.pensionAlimenticiaId.toString().padLeft(4, '0')}-0000"
            poliza.addToPartidas(toPolizaDet(cv, desc, row, egreso.importe))
            

        }
        if(nomina.otraDeduccion) {
            MovimientoDeCuenta mov = nomina.egreso
            poliza.concepto = "CH ${mov.referencia} ${mov.afavor} (${mov.fecha.format('dd/MM/yyyy')})" +
                    " (${mov.tipo} ${mov.tipo != mov.concepto ? mov.concepto : ''}) OTRA D"
            cv = "107-D004-${nomina.numeroDeTrabajador.toString().padLeft(4, '0')}-0000"
            poliza.addToPartidas(toPolizaDet(cv, desc, row, egreso.importe))
        }

        if(nomina.tipo == 'ASIMILADOS'){
            def query = "select * from nomina_por_empleado where id = ? "
            def queryUUID = "select * from cfdi where id = ? "
            def nom = findRegistro(query, [nomina.nominaEmpleado])
            def cfdi = findRegistro(queryUUID, [nom.cfdi_id])
            def total = nom.total_gravado
            def impuesto = nom.total - nom.total_gravado
            poliza.addToPartidas(toPolizaDet('600-P036-0001-0000', desc, row, total))
            poliza.addToPartidas(toPolizaDet('216-0003-0000-0000', desc, row, 0.00, impuesto))
            row.uuid = cfdi.uuid
            row.rfc = cfdi.receptor_rfc
        }

        //buildComplementoDePago(row, egreso)

        if(nomina.tipo != 'ASIMILADOS'){
          //  poliza.addToPartidas(toPolizaDet(cv, desc, row, egreso.importe))
        }
         
         // 

    }

    def cargoAbonoNomina(Poliza poliza, PagoDeNomina nomina, String id) {

        log.info('Generando cargo Abono de nomina {}', poliza.egreso)

        String select = getSelect().replaceAll('@NOMINA',id)

        List rows = loadRegistros(select, [])

        String desc = "${poliza.concepto} ${nomina.tipo} ${nomina.folio} ${nomina.pago})"

        rows.each{row ->
            if(row.tipo == 'P'){
                BigDecimal importe = row.importe_excento + row.importe_gravado
                poliza.addToPartidas(mapRow(desc, row, importe))
            } else if(row.tipo == 'D') {
                BigDecimal importe = row.importe_excento + row.importe_gravado
                poliza.addToPartidas(mapRow(desc, row, 0, importe))
            } else if(row.tipo == 'A') {
                if(row.importe_gravado > 0.0)
                    poliza.addToPartidas(mapRow(desc, row, row.importe_gravado))
                if(row.importe_excento > 0.0) {
                    PolizaDet det = mapRow(desc, row,  row.importe_excento)
                    det.cuenta = buscarCuenta(row.cta_contable_exe)
                    det.concepto = det.cuenta.descripcion
                    poliza.addToPartidas(det)
                }
            }
        }

        return poliza
        
    }

    void abonoBanco(Poliza poliza, PagoDeNomina nomina) {
        MovimientoDeCuenta egreso = nomina.egreso
        log.info('Abono a banco: {}', egreso)

        // Abono a Banco
        Map row = buildDataRow(egreso)
       // buildComplementoDePago(row, egreso)
        row.rfc = Empresa.first().rfc

        String desc = "${egreso.formaDePago == 'CHEQUE' ? 'CH:': 'TR:'} ${egreso.referencia} ${egreso.afavor} (${egreso.fecha.format('dd/MM/yyyy')})"

        poliza.addToPartidas(toPolizaDet(
                buildCuentaDeBanco(egreso),
                desc,
                row,
                0.0,
                egreso.importe.abs()))
    }


    PagoDeNomina findPago(Poliza poliza) {
        MovimientoDeCuenta egreso = MovimientoDeCuenta.get(poliza.egreso)
        PagoDeNomina r = PagoDeNomina.where{ egreso == egreso}.find()
        if(!r) throw new RuntimeException("Egreso ${egreso.id} de ${egreso.tipo} no tiene PagoDeNomina")
        return r
    }



    PolizaDet toPolizaDet(String cuentaClave, String descripcion, Map row, BigDecimal debe = 0.0, BigDecimal haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(cuentaClave)
        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: row.asiento,
                referencia: row.referencia,
                referencia2: row.referencia2,
                origen: row.origen,
                entidad: 'MovimientoDeCuenta',
                documento: row.documento,
                documentoTipo: row.documentoTipo,
                documentoFecha: row.documentoFecha,
                sucursal: row.sucursal,
                debe: debe.abs() ,
                haber: haber.abs(),
        )
        // Datos del complemento
        if(row.metodoDePago) {
            asignarComplementoDePago(det, row)
            det.moneda = row.moneda
            det.tipCamb = row.tipCamb

        }
        return det
    }


    PolizaDet mapRow(String concepto, Map row, def debe = 0.0, def haber = 0.0) {
        CuentaContable cuenta = buscarCuenta(row.cta_contable)
        String descripcion = concepto

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: "PROVISION_NOMINA",
                referencia: row.nombre,
                referencia2: row.periodicidad,
                //origen: row.ne_id.toString(),
                entidad: 'Nomina',
                documento: row.folio,
                documentoTipo: 'NOM',
                documentoFecha: row.pago,
                sucursal: row.ubicacion,
                debe: debe.abs(),
                haber: haber.abs()
        )
        
        return det
    }

    def loadRegistros(String sql, List params) {
        def db = getEmpleadosDB()
        try {
            return db.rows(sql, params)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }

     def findRegistro(String sql, List params) {
        def db = getEmpleadosDB()
        try {
            return db.firstRow(sql, params)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }


    def getEmpleadosDB() {
        String user = 'root'
        String password = 'sys'
        String driver = 'com.mysql.jdbc.Driver'
        String dbUrl = 'jdbc:mysql://10.10.1.229/sx_rh'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }  

       String getSelect() {
        String sql = """
        	SELECT 'DET' AGR,CONCAT(ifnull(E.apellido_paterno,'')," ",ifnull(E.apellido_materno,'')," ",E.nombres) AS nombre 
            ,(SELECT U.descripcion FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) AS ubicacion,(SELECT U.numero FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) ubic
		    ,n.pago,n.periodicidad
            ,NE.TOTAL AS montoTotal,'210-0001-0000-0000' cta_nomina_por_pagar
		    ,c.clave,c.descripcion,sum(ned.importe_gravado) importe_gravado ,sum(ned.importe_excento) importe_excento
            ,(case when c.clave in('D004','D006','D014','P039') THEN concat(c.clase,'-',p.numero_de_trabajador,'-0000')
            when c.clave='D007' then concat(c.clase,(SELECT concat((case when x.id>9 then '-00' else '-000' end),cast(x.id as char(4))) from pension_alimenticia x where x.empleado_id=e.id),'-0000')
            else c.clase end) cta_contable,'000-0000-0000-0000' cta_contable_exe,(case when substr(c.clave,1,1)='P' then 'P'  else 'D' end) tipo,n.folio
            FROM nomina_por_empleado_det ned 
            join nomina_por_empleado ne on(ne.id=ned.parent_id) 
            join nomina n on(n.id=ne.nomina_id) 
            join empleado e on(e.id=ne.empleado_id)
            JOIN perfil_de_empleado P ON(E.ID=P.empleado_id)
            join concepto_de_nomina c on(c.id=ned.concepto_id)
            join seguridad_social s on(e.id=s.empleado_id)
            where c.clave in('D004','D005','D006','D007','D014','P039') AND 
            @NOMINA
            group by 2,3,6,9,13,14,15               
			union			
		    SELECT	  'ACU' AGR,(SELECT U.descripcion FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) AS nombre 
            ,(SELECT U.descripcion FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) AS ubicacion,(SELECT U.numero FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) ubic
		    ,n.pago,n.periodicidad
            ,NE.TOTAL AS montoTotal,'210-0001-0000-0000' cta_nomina_por_pagar
		    ,c.clave,c.descripcion,sum(ned.importe_gravado) importe_gravado ,sum(ned.importe_excento) importe_excento
            ,(case when c.clave in('P001','P007','P009','P010','P011','P023','P025','P026','P029','P032','P034','P035','P037','P038') then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where ne.UBICACION_ID=x.ID),'-0000')
            when c.clave in('P002','P022','P024','P030') then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where x.id=p.ubicacion_id),'-0002')
             when c.clave in('P028') then '255-0004-0003-0000' when c.clave in('P003') then '215-0001-0002-0000'
            else c.clase end) cta_contable
            ,(case when ned.importe_excento>0 and c.clave in('P002','P022','P024','P030','P026')  then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where ne.UBICACION_ID=x.ID),'-0001')
                when ned.importe_excento>0 and c.clave in('P028')  then'255-0004-0002-0000' when c.clave in('P003') then '215-0001-0001-0000'
            else '000-0000-0000-0000'end) cta_contable_exe
            ,(case when c.clave in('P002','P003','P022','P024','P026','P028','P030') then 'A' when substr(c.clave,1,1)='P' then 'P'  else 'D' end) tipo,n.folio
            FROM nomina_por_empleado_det ned 
            join nomina_por_empleado ne on(ne.id=ned.parent_id) 
            join nomina n on(n.id=ne.nomina_id) 
            join empleado e on(e.id=ne.empleado_id)
            JOIN perfil_de_empleado P ON(E.ID=P.empleado_id)
            join concepto_de_nomina c on(c.id=ned.concepto_id)
            join seguridad_social s on(e.id=s.empleado_id)
            where c.clave not in('D004','D005','D006','D007','D014','P039') AND  
            @NOMINA
            group by 2,3,6,9,13,14,15
        """
        return sql
    }  

}
