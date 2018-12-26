package sx.integracion

import groovy.sql.Sql
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.core.Proveedor
import sx.cxp.Pago
import sx.cxp.PagoService
import sx.cxp.RequisicionDeCompras

import sx.tesoreria.Cheque
import sx.tesoreria.CuentaDeBanco
import sx.tesoreria.MovimientoDeCuenta
import sx.utils.Periodo

import java.sql.SQLException

@Slf4j
class ImportadorDeReqsuicionesDeCompras {

    ImportadorDeReqsuicionesDeCompras importarEgresos(int ejercicio, int mes){
        List<Map> rows = getRows("""
        select * from sw_bcargoabono 
        where origen = 'COMPRAS' 
        and year(fecha) > ?  and month(fecha) = ? 
        order by fecha asc
        """, ejercicio, mes)

        Sql db = getSql()

        rows.each { row ->
            try {
                Long egresoId = row['cargoabono_id'] as Long
                RequisicionDeCompras requisicion = findRequisicion(db, egresoId)
                if(requisicion) {
                    MovimientoDeCuenta egreso = findEgreso(row, requisicion.formaDePago)
                    requisicion.egreso = egreso
                    requisicion.pagada = egreso.fecha
                    egreso.save failOnError: true, flush: true
                    requisicion.save failOnError: true, flush: true
                    if(egreso.formaDePago == 'CHEQUE') {
                        Cheque cheque = findCheque(egreso, row)
                        egreso.cheque = cheque
                        cheque.save failOnError: true, flush: true
                        egreso.save
                    }
                    log.info('Requisicion importada {}', requisicion)
                }

            }catch(Exception ex) {
                def message = ExceptionUtils.getRootCauseMessage(ex)
                log.error('Error importando {} {}', row ,message)
            }
        }

        db.close()
        return this

    }



    RequisicionDeCompras findRequisicion(Sql db, Long id) {
        String SELECT = """
            select * from sw_trequisicion where cargoabono_id = ?
        """
        Map row = db.firstRow(SELECT,[id])

        RequisicionDeCompras found = RequisicionDeCompras.where{sw2 == row.requisicion_id}.find()
        if(found){
            log.info('Req ya iportada: {} ', row.sw2)
            return null
        }
        RequisicionDeCompras req = new RequisicionDeCompras()
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
        return req
    }


    MovimientoDeCuenta findEgreso(Map row, String formaDePago) {
        def cuenta = CuentaDeBanco.where{sw2 == row.cuenta_id}.find()
        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = 'COMPRA'
        egreso.concepto = 'COMPRA'
        egreso.importe = row.importe
        egreso.fecha = row.fecha
        egreso.moneda = Currency.getInstance(row.moneda)
        egreso.tipoDeCambio = row.tc
        egreso.comentario = row.comentario
        egreso.formaDePago = formaDePago
        egreso.referencia = row.referencia
        egreso.afavor = row.afavor
        egreso.cuenta = cuenta
        egreso.createUser = 'admin'
        egreso.updateUser = 'admin'
        egreso.sw2 = row.cargoabono_id
        return egreso
    }


    Cheque findCheque(MovimientoDeCuenta egreso, Map row) {
        Cheque cheque = new Cheque()
        cheque.cuenta = egreso.cuenta
        cheque.nombre = egreso.afavor
        cheque.fecha = egreso.fecha
        cheque.folio = egreso.referencia.toLong()
        cheque.importe = egreso.importe.abs()
        cheque.egreso = egreso
        cheque.impresion = row.impreso
        cheque.cobrado = row.FECHACOBRADO
        return  cheque
    }

    ImportadorDeReqsuicionesDeCompras importarPagosCxP(PagoService pagoService, Periodo periodo) {
        def c = RequisicionDeGastos.createCriteria()
        List<RequisicionDeCompras> results = c {
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

}
