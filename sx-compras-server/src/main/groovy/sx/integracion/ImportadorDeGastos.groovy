package sx.integracion



import sx.cxp.Pago
import sx.cxp.PagoService
import sx.cxp.Rembolso
import sx.tesoreria.Cheque
import sx.tesoreria.CuentaDeBanco
import sx.tesoreria.MovimientoDeCuenta

import java.sql.SQLException

import groovy.sql.*

import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils

import sx.core.Proveedor
import sx.cxp.RequisicionDeGastos
import sx.utils.Periodo



@Slf4j
class ImportadorDeGastos {


    RequisicionDeGastos importarRequisicion(Long id){
        def select = """
    	select c.tipo as gtipo, t.*,d.documento,pp.rfc as rfc2, c.proveedor_id as prov , pp.nombre as provNombre
        from sw_trequisicion t 
        join sw_trequisiciondet d on(t.requisicion_id = d.requisicion_id)
        join sx_gas_facxreq2 g on(g.requisicionesdet_id = d.requisicionde_id)
        join sw_facturas_gastos f on(g.factura_id = f.id)
        join sw_gcompra c on(f.compra_id = c.compra_id)
        join sw_gproveedor pp on(pp.proveedor_id = c.proveedor_id)
        where t.requisicion_id = ?
        """
        Sql db = getSql()
        Map row = db.firstRow(select,[id])
        log.info('Importando requisicion: {}, con Reg:{} ', id, row)
        RequisicionDeGastos req = importarRegistro(row)
        if(!req.egreso){
            Map egresoRow = findEgreso(db, req)
            MovimientoDeCuenta egreso = importarEgreso(egresoRow, req)
            req.egreso = egreso
            req.pagada = egreso.fecha
            req = req.save flush: true
            log.info('Egreso generado: {}', req.egreso)
        }
        if(req.egreso && req.egreso.formaDePago == 'CHEQUE' && req.egreso.cheque == null) {

            log.info('Generando cheque para egreso {}', req.egreso.id)
            Map egresoRow = findEgreso(db, req)
            MovimientoDeCuenta egreso = req.egreso

            def chequeFound = Cheque.where{folio == egreso.referencia.toLong()}.find()
            if(chequeFound) {
                def mov = MovimientoDeCuenta.where{cheque == chequeFound}.find()
                def rembolso = Rembolso.where{egreso == mov}.find()
                if(rembolso) {
                    log.info("Rembolso: {} ELIMINANDOLO", rembolso)
                    rembolso.egreso = null
                    rembolso.delete flush: true

                    mov.cheque = null
                    mov.delete flush: true

                    chequeFound.delete flush: true
                }
            }


            Cheque cheque = new Cheque()
            cheque.cuenta = egreso.cuenta
            cheque.nombre = egreso.afavor
            cheque.fecha = egreso.fecha
            cheque.folio = egreso.referencia.toLong()
            cheque.importe = egreso.importe.abs()
            cheque.egreso = egreso
            cheque.impresion = egresoRow.impreso
            cheque.cobrado = egresoRow.FECHACOBRADO
            cheque = cheque.save failOnError: true, flush: true
            egreso.cheque = cheque
            egreso.save flush: true

            log.info('Generando cheque: {}', cheque)

        }
        return req

    }




    ImportadorDeGastos importarRequisiciones(Periodo periodo) {
        def select = """
    	select c.tipo as gtipo, t.*,d.documento,pp.rfc as rfc2, c.proveedor_id as prov , pp.nombre as provNombre
        from sw_trequisicion t 
        join sw_trequisiciondet d on(t.requisicion_id = d.requisicion_id)
        join sx_gas_facxreq2 g on(g.requisicionesdet_id = d.requisicionde_id)
        join sw_facturas_gastos f on(g.factura_id = f.id)
        join sw_gcompra c on(f.compra_id = c.compra_id)
        join sw_gproveedor pp on(pp.proveedor_id = c.proveedor_id)
        where origen = 'GASTOS' and pp.rfc is not null
        and date(t.fecha) between ? and ? 
        order by t.fecha """
        def rows = getRows(select, periodo.fechaInicial, periodo.fechaFinal)
        rows.each { row ->
            try {
                importarRegistro(row)
            }catch(Exception ex) {
                def message = ExceptionUtils.getRootCauseMessage(ex)
                log.error('Error importando {} {}', row.requsicion_id, message)
            }
        }
        return this
    }

    ImportadorDeGastos importarEgresos(Periodo periodo){
        def c = RequisicionDeGastos.createCriteria()
        def results = c {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
            isNull("egreso")
        }
        def db = getSql()
        results.each { RequisicionDeGastos it ->
            try {
                def row = findEgreso(db, it)
                if(row){
                    log.info('CargoAbono a importar: {}' , row.cargoabono_id)
                    MovimientoDeCuenta egreso = importarEgreso(row, it)
                    it.egreso = egreso
                    it.pagada = egreso.fecha
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

    ImportadorDeGastos importarCheques(Periodo periodo) {
        def c = RequisicionDeGastos.createCriteria()
        List<RequisicionDeGastos> results = c {
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

    ImportadorDeGastos importarPagosCxP(PagoService pagoService, Periodo periodo) {
        def c = RequisicionDeGastos.createCriteria()
        List<RequisicionDeGastos> results = c {
            between("fecha", periodo.fechaInicial, periodo.fechaFinal)
        }
        results.each { req ->
            try {
                Pago found = Pago.where{requisicion.id == req.id}.find()
                if(!found) {
                    Pago pago = pagoService.generarPagoDeRequisicion(req)
                    pagoService.aplicarPago(pago)
                    log.info("Pago generado: {}", pago.id)
                }
            }catch(Exception ex) {
                log.error('Error generando cheque: {}' , ex.message)
            }

        }
        return this
    }



    def importarRegistro(def row) {
        def found = RequisicionDeGastos.where{folio == row.requisicion_id}.find()
        if(found){
            log.info('Req ya iportada: {} ', row.requisicion_id)
            return found
        }
        Proveedor proveedor = Proveedor.where{rfc == row.rfc2}.find()
        if(!proveedor) {
            println "Registrando proveedor: ${row.provNombre?: row.afavor} RFC: ${row.rfc2}"
            proveedor = new Proveedor(nombre: row.provNombre?: row.afavor, rfc: row.rfc2, tipo: 'GASTOS')
            proveedor.clave = "GS${row.rfc2[0..-6]}"
            proveedor.save failOnError: true, flush: true
            log.info('Proveedor nuevo: {}', proveedor)
        }
        RequisicionDeGastos req = new RequisicionDeGastos()
        req.folio = row.requisicion_id
        req.proveedor = Proveedor.where{rfc == row.rfc2}.find()
        req.nombre = row.afavor
        req.moneda = row.MONEDA
        req.tipoDeCambio = row.tc
        req.fecha = row.fecha
        req.fechaDePago = row.fechaDePago
        req.formaDePago = row.FORMADEPAGO == 1 ? 'CHEQUE' : 'TRANSFERENCIA'
        req.total = row.total
        req.apagar = row.total
        req.comentario = row.COMENTARIO
        req.sw2 = req.folio
        req.createUser = 'ADMIN'
        req.updateUser = 'ADMIN'
        req.save failOnError:true, flush:true
        log.info("Requisicion importada {}", req.id)
        return req
    }

    def findEgreso(Sql db, RequisicionDeGastos row) {
        def SQL = """
    	select * from sw_bcargoabono 
         where cargoabono_id = (select cargoabono_id from sw_trequisicion where requisicion_id = ?)
        """
        return db.firstRow(SQL,[row.folio])
    }

    MovimientoDeCuenta importarEgreso(def row, def requisicionDeGastos) {
        def cuenta = CuentaDeBanco.where{sw2 == row.cuenta_id}.find()
        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = 'GASTO'
        egreso.importe = row.importe
        egreso.fecha = row.fecha
        egreso.concepto = 'GASTO'
        egreso.moneda = Currency.getInstance(row.moneda)
        egreso.tipoDeCambio = row.tc
        egreso.comentario = row.comentario
        egreso.formaDePago = requisicionDeGastos.formaDePago
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
        List<RequisicionDeGastos> gastos = RequisicionDeGastos.where{formaDePago == 'CHEQUE'}.list()
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
