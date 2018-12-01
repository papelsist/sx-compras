package sx.integracion

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.Sucursal
import sx.cxp.Rembolso
import sx.tesoreria.Cheque
import sx.tesoreria.CuentaDeBanco
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.Periodo

import java.sql.SQLException

@Slf4j
class ImportadorDeRembolsos {


    ImportadorDeRembolsos importar(Periodo periodo) {
        def select = """
    	select
    	t.*, 
    	c.sucursal_id, 
    	c.tipo as gtipo,
    	d.documento,
    	pp.rfc as rfc2, 
    	c.proveedor_id as prov , 
    	pp.nombre as provNombre
        from sw_trequisicion t 
        join sw_trequisiciondet d on(t.requisicion_id = d.requisicion_id)
        join sx_gas_facxreq2 g on(g.requisicionesdet_id = d.requisicionde_id)
        join sw_facturas_gastos f on(g.factura_id = f.id)
        join sw_gcompra c on(f.compra_id = c.compra_id)
        join sw_gproveedor pp on(pp.proveedor_id = c.proveedor_id)
        where origen = 'GASTOS' and pp.rfc is null
        and date(t.fecha) between ? and ? 
        order by t.fecha """
        def rows = getRows(select, periodo.fechaInicial, periodo.fechaFinal)
        rows.each { row ->
            try {
                importarRembolso(row)
            }catch(Exception ex) {
                ex.printStackTrace()
                def message = ExceptionUtils.getRootCauseMessage(ex)
                log.error('Error importando {} {}', row.REQUISICION_ID, message)
            }
        }
        return this
    }

    def importarRembolso(def row) {
        log.info('Impotando: {}', row)
        def found = Rembolso.where{sw2 == row.REQUISICION_ID}.find()
        if(found){
            log.info('Rembolso ya iportado: {} ', row.REQUISICION_ID)
            return
        }
        Rembolso rembolso = new Rembolso()
        rembolso.with {
            formaDePago = row.FORMADEPAGO == 1 ? 'CHEQUE' : 'TRANSFERENCIA'
            sw2 = row.REQUISICION_ID
            sucursal = Sucursal.where{ sw2 == row.sucursal_id}.find()
            concepto = 'REMBOLSO'
            nombre = row.afavor
            fecha = row.fecha
            fechaDePago = row.fechaDePago
            comentario = row.comentario
            total = row.total
            apagar = row.total
            createUser = 'ADMIN'
            updateUser = 'ADMIN'
        }
        rembolso = rembolso.save failOnError: true, flush: true
        log.info("Rembolso importado {}", rembolso.id)
    }

    ImportadorDeRembolsos importarEgresos(Periodo periodo){
        def c = Rembolso.createCriteria()
        def results = c {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
            isNull("egreso")
        }
        def db = getSql()
        results.each {Rembolso it ->
            try {
                def row = findEgreso(db, it)
                if(row){
                    log.info('CargoAbono a importar: {}' , row.cargoabono_id)
                    MovimientoDeCuenta egreso = importarEgreso(row, it)
                    it.egreso = egreso
                    it.save flush: true
                }
            }catch (SQLException e){
                def ex = ExceptionUtils.getRootCause(e)
                def message = ExceptionUtils.getRootCauseMessage(e)
                println 'Error buscando egreso ' + message
            }

        }
        db.close()
        return this
    }



    def findEgreso(Sql db, Rembolso row) {
        def SQL = """
    	select * from sw_bcargoabono 
         where cargoabono_id = (select cargoabono_id from sw_trequisicion where requisicion_id = ?)
        """
        return db.firstRow(SQL,[row.sw2])
    }

    MovimientoDeCuenta importarEgreso(def row, Rembolso rembolso) {
        def cuenta = CuentaDeBanco.where{sw2 == row.cuenta_id}.find()
        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = 'GASTO'
        egreso.importe = row.importe
        egreso.fecha = row.fecha
        egreso.concepto = 'REMBOLSO'
        egreso.moneda = Currency.getInstance(row.moneda)
        egreso.tipoDeCambio = row.tc
        egreso.comentario = row.comentario
        egreso.formaDePago = rembolso.formaDePago
        egreso.referencia = row.referencia
        egreso.afavor = row.afavor
        egreso.cuenta = cuenta
        egreso.createUser = 'admin'
        egreso.updateUser = 'admin'
        egreso.sw2 = row.cargoabono_id
        // requisicionDeGastos.save(flush: true)
        // egreso.save failOnError: true, flush: true
        return egreso
    }

    ImportadorDeRembolsos importarCheques(Periodo periodo) {
        def c = Rembolso.createCriteria()
        List<Rembolso> results = c {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
            isNotNull("egreso")
            eq('formaDePago', 'CHEQUE')
            egreso {
                isNull('cheque')
            }
        }
        Sql db = getSql()
        results.each {
            try {
                def row = findEgreso(db, it)
                MovimientoDeCuenta egreso = it.egreso
                Cheque cheque = new Cheque()
                cheque.cuenta = egreso.cuenta
                cheque.nombre = egreso.afavor
                cheque.fecha = egreso.fecha
                cheque.folio = egreso.referencia.toLong()
                cheque.importe = egreso.importe.abs()
                cheque.egreso = egreso
                cheque.impresion = row.impreso
                cheque.cobrado = row.FECHACOBRADO

                cheque.save failOnError: true, flush: true

                egreso.cheque = cheque
                egreso.save flush: true

                log.info('Generando cheque: {}', it)
            }catch(Exception ex) {
                log.error('Error generando cheque {}' , ex.message)
            }
        }
        db.close()
        return this
    }




    def getRows(String sql, ...params) {
        def db = getSql()
        try {
            return db.rows(sql,params)
        }catch (SQLException e){
            e.printStackTrace()
            def c = ExceptionUtils.getRootCause(e)
            def message = ExceptionUtils.getRootCauseMessage(e)
            throw new RuntimeException(message,c)
        }finally {
            db.close()
        }
    }


    def getSql() {
        String user = 'root'
        String password = 'sys'
        String driver = 'com.mysql.jdbc.Driver'
        String dbUrl = 'jdbc:mysql://10.10.1.228/produccion'
        Sql db = Sql.newInstance(dbUrl, user, password, driver)
        return db
    }


    def updateCheques(){
        List<Rembolso> gastos = Rembolso.where{formaDePago == 'CHEQUE'}.list()
        Sql db = getSql()
        gastos.each { gasto ->
            if(gasto.egreso && gasto.egreso.cheque) {
                Cheque cheque = gasto.egreso.cheque
                try {
                    def row = findEgreso(db, gasto)
                    println 'ROW:' + row
                    cheque.impresion = row.impreso
                    cheque.cobrado = row.FECHACOBRADO
                    cheque.save flush: true
                    log.info('Cheque actualizado: {}', cheque)
                }catch(Exception ex) {
                    log.error('Error generando cheque {}' , ex.message)
                }
            }
        }
        db.close()
        return this
    }


}
