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
class ProvisionNominaProc implements  ProcesadorMultipleDePolizas, AsientoBuilder{


    @Override
    String definirConcepto(Poliza poliza) {
        return "PROVISION DE NOMINA  ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        poliza = poliza.save failOnError:true, flush: true
        poliza.refresh()
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {

        log.info('Generando asientos de provision de nomina {}', poliza.egreso)
        def pms = poliza.egreso.split(';')
        String select = getSelect().replaceAll('@PAGO', pms[0]).replaceAll('@PERIODICIDAD', pms[1])
        
        List rows = loadRegistros(select, [])

        rows.each{row ->
            if(row.tipo == 'P'){
                BigDecimal importe = row.importe_excento + row.importe_gravado
                poliza.addToPartidas(mapRow(poliza.concepto, row, importe))
            } else if(row.tipo == 'D') {
                BigDecimal importe = row.importe_excento + row.importe_gravado
                poliza.addToPartidas(mapRow(poliza.concepto, row, 0, importe))
            } else if(row.tipo == 'A') {
                if(row.importe_gravado > 0.0)
                    poliza.addToPartidas(mapRow(poliza.concepto, row, row.importe_gravado))
                if(row.importe_excento > 0.0) {
                    PolizaDet det = mapRow(poliza.concepto, row,  row.importe_excento)
                    det.cuenta = buscarCuenta(row.cta_contable_exe)
                    det.concepto = det.cuenta.descripcion
                    poliza.addToPartidas(det)
                }
            }
        }

        Map rowTotal = [
            cta_contable: '210-0001-0000-0000',
            nombre: 'OFICINAS',
            periodicidad: pms[1],
            folio: pms[3],
            pago: poliza.fecha,
            ubicacion:'OFICINAS'
        ]
        def montoTotal = new BigDecimal(pms[2])
        PolizaDet detTotal = mapRow(poliza.concepto,rowTotal,0.00,montoTotal)
        //log.info("Det: {}", detTotal.validate())
        //log.info("Det: {}", detTotal.errors)
        poliza.addToPartidas(detTotal)
        return poliza
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

    def validarCuentas(List rows) {
        Map data = rows.groupBy {it.cta_contable}
        data.entrySet().each {
            String cve = it.key.toString()
            Map row = it.value[0]
            CuentaContable cuenta = CuentaContable.where{clave == cve}.find()
            if(!cuenta) {
                // CuentaContable padre = cve.substring(0, 8)
                String cvePadre = "${cve.substring(0, 8)}-0000-0000"
                CuentaContable padre = buscarCuenta(cvePadre)
                log.info('No existe cuenta: {} padre: {}', cve, padre)
                CuentaContable nuevaCuenta = new CuentaContable(clave: cve, descripcion:row.nombre)
                nuevaCuenta.nivel = 4
                nuevaCuenta.tipo = padre.tipo
                nuevaCuenta.subTipo = padre.subTipo
                nuevaCuenta.cuentaSat = padre.cuentaSat
                nuevaCuenta.detalle = true
                nuevaCuenta.deResultado = padre.deResultado
                nuevaCuenta.naturaleza = padre.naturaleza
                nuevaCuenta.presentacionContable = padre.presentacionContable
                nuevaCuenta.presentacionFiscal = padre.presentacionFiscal
                nuevaCuenta.presentacionFinanciera = padre.presentacionFinanciera
                nuevaCuenta.presentacionPresupuestal = padre.presentacionPresupuestal
                padre.addToSubcuentas(nuevaCuenta)
                padre.save flush: true
                log.info("Cuenta nueva: {}", nuevaCuenta)
            }
        }
    }

    @Override
    List<Poliza> generarPolizas(PolizaCreateCommand command) {
        String query = "select folio,periodicidad,pago,sum(total) as total from nomina where pago = ? group by folio,periodicidad"
        println "SQL: ${query}"
        List<Poliza> polizas = []
        def polizasRow = loadRegistros(query,[command.fecha])
        polizasRow.each{
            Map map = it
            Poliza p = Poliza.where{
                ejercicio == command.ejercicio &&
                mes == command.mes &&
                subtipo == command.subtipo &&
                tipo == command.tipo &&
                fecha == command.fecha
                
            }.find()
            

            if(p == null) {
                p = new Poliza(command.properties)
                p.concepto = "NOMINA: ${map.folio} (${map.pago.format('dd/MM/yyyy')})  ${map.periodicidad} "         
                p.sucursal = 'OFICINAS'
                p.egreso = "${map.pago.format('yyyy/MM/dd')};${map.periodicidad};${map.total};${map.folio}"
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)
              
            
        }


        return polizas
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
            ,(case when c.clave in('D004','D005','D006','D014','P039') THEN concat(c.clase,'-',p.numero_de_trabajador,'-0000')
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
            n.pago='@PAGO' AND n.periodicidad ='@PERIODICIDAD'
            group by 2,3,6,9,13,14,15               
			union			
		    SELECT	  'ACU' AGR,(SELECT U.descripcion FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) AS nombre 
            ,(SELECT U.descripcion FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) AS ubicacion,(SELECT U.numero FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) ubic
		    ,n.pago,n.periodicidad
            ,NE.TOTAL AS montoTotal,'210-0001-0000-0000' cta_nomina_por_pagar
		    ,c.clave,c.descripcion,sum(ned.importe_gravado) importe_gravado ,sum(ned.importe_excento) importe_excento
            ,(case when c.clave in('P001','P007','P009','P010','P011','P023','P025','P026','P029','P032','P034','P035','P037','P038') then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where ne.UBICACION_ID=x.ID),'-0000')
            when c.clave in('P002','P003','P022','P024','P030') then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where x.id=p.ubicacion_id),'-0002')
             when c.clave in('P028') then '255-0004-0003-0000'
            else c.clase end) cta_contable
            ,(case when ned.importe_excento>0 and c.clave in('P002','P003','P022','P024','P030')  then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where ne.UBICACION_ID=x.ID),'-0001')
                when ned.importe_excento>0 and c.clave in('P028')  then'255-0004-0002-0000'
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
            n.pago='@PAGO' AND n.periodicidad ='@PERIODICIDAD'
            group by 2,3,6,9,13,14,15
        """
        return sql
    }


}
