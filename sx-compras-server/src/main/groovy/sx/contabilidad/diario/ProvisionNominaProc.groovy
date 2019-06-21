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

    //@Autowired
    //@Qualifier('inventariosProcGeneralesTask')


    @Override
    String definirConcepto(Poliza poliza) {
        return "PROVISION DE NOMINA  ${poliza.fecha.format('dd/MM/yyyy')}"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        poliza = poliza.save flush: true
        poliza.refresh()
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
        log.info('Generando asientos de provision de nomina {}', poliza)
        // PagoDeNomina pago = PagoDeNomina.where{nomina == poliza.egreso}.find()
        List rows = loadRegistros(getSelect(), [poliza.egreso])
        // rows.groupBy {it.cta_contable}
        validarCuentas(rows)

        Map map = rows.groupBy {it.ne_id}

        map.entrySet().each {
            List data = it.value
            data.each { row ->
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
            def row = data[0]
            PolizaDet partidaDePago = mapRow(poliza.concepto, row, 0.0, row.montoTotal)
            partidaDePago.cuenta = buscarCuenta(row.cta_nomina_por_pagar.toString())
            partidaDePago.concepto = partidaDePago.cuenta.descripcion
            poliza.addToPartidas(partidaDePago)

        }


        // poliza.refresh()
        return poliza
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
        println "Generando Polizssss"
        String query = "select id,folio,tipo,forma_de_pago as formaDePago ,pago, substr(periodicidad,1,1) as per  from nomina where pago = ?"
        List<Poliza> polizas = []
        def polizasRow = loadRegistros(query,[command.fecha])
        polizasRow.each{
            Map map = it
            println map.id
            Poliza p = Poliza.where{
                ejercicio == command.ejercicio &&
                mes == command.mes &&
                subtipo == command.subtipo &&
                tipo == command.tipo &&
                fecha == command.fecha &&
                egreso == map.id
            }.find()
            

            if(p == null) {

                p = new Poliza(command.properties)
                p.concepto = "NOMINA: ${map.id} Folio:${map.folio} ${map.tipo} ${map.formaDePago} " +
                        "(${map.pago.format('dd/MM/yyyy')})  ${map.per}"
                p.sucursal = 'OFICINAS'
                p.egreso = map.id
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)
              
            
        }
        /*
        List<PagoDeNomina> pagos = PagoDeNomina.where{pago == command.fecha && pensionAlimenticia == false}.list()
        Map<Long, PagoDeNomina> map = pagos.collectEntries {
            [(it.nomina): it]
        }

        map.entrySet().each {
            PagoDeNomina pago = it.value
            MovimientoDeCuenta mov = pago.egreso
            Poliza p = Poliza.where{
                ejercicio == command.ejercicio &&
                mes == command.mes &&
                subtipo == command.subtipo &&
                tipo == command.tipo &&
                fecha == command.fecha &&
                egreso == mov.id
            }.find()

            if(p == null) {

                p = new Poliza(command.properties)
                p.concepto = "NOMINA: ${pago.nomina} Folio:${pago.folio} ${pago.tipo} ${pago.formaDePago} " +
                        "(${pago.pago.format('dd/MM/yyyy')})"
                p.sucursal = 'OFICINAS'
                p.egreso = mov.id
                polizas << p
            } else
                log.info('Poliza ya existente  {}', p)
        }
*/

        return polizas
    }




    PolizaDet mapRow(String concepto, Map row, def debe = 0.0, def haber = 0.0) {

        CuentaContable cuenta = buscarCuenta(row.cta_contable)
       // String descripcion = "NOMINA: ${pago.nomina} Folio:${pago.folio} ${pago.tipo} ${pago.formaDePago} " +
         //       "(${pago.pago.format('dd/MM/yyyy')})"
         String descripcion = concepto

        PolizaDet det = new PolizaDet(
                cuenta: cuenta,
                concepto: cuenta.descripcion,
                descripcion: descripcion,
                asiento: "NOMINA ${row.tipo}",
                referencia: row.nombre,
                referencia2: row.periodicidad,
                origen: row.ne_id.toString(),
                entidad: 'NominaEmpleado',
                documento: row.ne_id.toString(),
                documentoTipo: 'NOM',
                documentoFecha: row.fechaDocumento,
                sucursal: row.ubicacion,
                debe: debe.abs(),
                haber: haber.abs()
        )
        // Datos del complemento
        //asignarComprobanteNacional(det, row)
        //
        det.uuid = row.uuid
        det.rfc = row.rfc
        det.montoTotal = row.montoTotal
        det.moneda = 'MXN'
        det.tipCamb = 1.0

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
            SELECT E.id,E.clave,CONCAT(ifnull(E.apellido_paterno,'')," ",ifnull(E.apellido_materno,'')," ",E.nombres) AS nombre,P.numero_de_trabajador,e.rfc as rfc
            ,(SELECT U.descripcion FROM ubicacion U WHERE ne.UBICACION_ID=U.ID) AS ubicacion,e.alta,e.status
            ,n.id n_id,N.tipo,n.forma_de_pago,n.periodicidad,n.folio,n.pago,ne.id ne_id,(ne.salario_diario_base) as sdb,ned.id ne_det_id
            ,NE.TOTAL AS montoTotal,'210-0001-0000-0000' cta_nomina_por_pagar
            ,(SELECT X.UUID FROM CFDI X WHERE NE.CFDI_ID=X.ID) AS uuid
            ,(SELECT X.FECHA FROM CFDI X WHERE NE.CFDI_ID=X.ID) AS fechaDocumento
            ,(CASE WHEN N.FORMA_DE_PAGO ='CHEQUE' THEN '044' ELSE '002' END) AS CTA_ORI
            ,(CASE WHEN N.FORMA_DE_PAGO ='CHEQUE' THEN 'SCOTIABANK' ELSE 'BANAMEX' END) AS BANCO_ORI
            ,(SELECT CASE WHEN X.CLABE IS NULL THEN X.NUMERO_DE_CUENTA ELSE X.CLABE END FROM salario X WHERE X.EMPLEADO_ID=E.ID) AS CTA_BANCO_EMPLEADO_DEST
            ,(CASE WHEN N.FORMA_DE_PAGO ='CHEQUE' THEN '' ELSE '002' END) AS BANCO_CLAVE_DEST
            ,(CASE WHEN N.FORMA_DE_PAGO ='CHEQUE' THEN '' ELSE 'BANAMEX' END) AS BANCO_NOMBRE_DEST,
            c.clave,c.descripcion,ned.importe_gravado ,ned.importe_excento ,(SELECT x.numero from ubicacion x where x.id=p.ubicacion_id) ubic
            ,(case when c.clave in('D004','D005','D006','D014','P039') THEN concat(c.clase,'-',p.numero_de_trabajador,'-0000')
            when c.clave='D007' then concat(c.clase,(SELECT concat((case when x.id>9 then '-00' else '-000' end),cast(x.id as char(4))) from pension_alimenticia x where x.empleado_id=e.id),'-0000')
            when c.clave in('D012','P001','P007','P009','P010','P011','P023','P025','P026','P029','P032','P034','P035','P037','P038') then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where x.id=p.ubicacion_id),'-0000')
            when c.clave in('P002','P003','P022','P024','P028','P030') then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where x.id=p.ubicacion_id),'-0002')
            else c.clase end) cta_contable
            ,(case when ned.importe_excento>0 and c.clave in('P002','P003','P022','P024','P028','P030')  then concat(c.clase,(SELECT concat((case when x.numero>9 then '-00' else '-000' end),x.numero) from ubicacion x where x.id=p.ubicacion_id),'-0001')
            else '000-0000-0000-0000'end) cta_contable_exe
            ,(case when c.clave in('P002','P003','P022','P024','P026','P028','P030') then 'A' when substr(c.clave,1,1)='P' then 'P'  else 'D' end) tipo
            FROM nomina_por_empleado_det ned 
            join nomina_por_empleado ne on(ne.id=ned.parent_id) 
            join nomina n on(n.id=ne.nomina_id) 
            join empleado e on(e.id=ne.empleado_id)
            JOIN perfil_de_empleado P ON(E.ID=P.empleado_id)
            join concepto_de_nomina c on(c.id=ned.concepto_id)
            join seguridad_social s on(e.id=s.empleado_id)
            where n.id=?
        """
        return sql
    }


}
