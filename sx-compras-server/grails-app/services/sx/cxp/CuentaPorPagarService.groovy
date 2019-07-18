package sx.cxp

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import sx.core.Proveedor
import sx.utils.Periodo

// @Transactional
@Slf4j
class CuentaPorPagarService {

    EstadoDeCuentaProveedor estadoDeCuenta(Proveedor proveedor, Periodo periodo) {

        Set<EstadoDeCuentaRow> movimientos = []
        movimientos.addAll(findCargos(proveedor,periodo))
        movimientos.addAll(findAbonos(proveedor,periodo))
        movimientos.sort {it.fecha}

        EstadoDeCuentaProveedor estado = new EstadoDeCuentaProveedor()
        estado.proveedor = proveedor
        estado.periodo = periodo
        estado.movimientos = movimientos
        estado.saldoInicial = saldoInicial(proveedor, periodo.fechaInicial)
        estado.cargos = estado.sumCargos()
        estado.abonos = estado.sumAbonos()
        estado.saldoFinal = estado.saldoInicial + estado.cargos + estado.abonos 
        return estado
    }

    def saldoInicial(Proveedor p, Date fecha) {
       def res = CuentaPorPagar.findAll("""
            select sum(saldoReal) from CuentaPorPagar where proveedor = ? and fecha < ?
       """, [p, fecha])[0] 
    }

    
    def findCargos(Proveedor proveedor, Periodo periodo) {
        List res = CuentaPorPagar.findAll(
                """
                select new sx.cxp.EstadoDeCuentaRow(
                    c.id, 
                    c.nombre, 
                    c.serie, 
                    c.folio, 
                    c.tipo, 
                    c.fecha, 
                    c.moneda, 
                    c.tipoDeCambio, 
                    c.total, 
                    'FACTURA'
                    )  
                    from CuentaPorPagar c 
                        where c.proveedor = ? 
                        and c.fecha  between ? and ?
                """,
                [proveedor, periodo.fechaInicial, periodo.fechaFinal])
        return res
    }

    def findAbonos(Proveedor proveedor, Periodo periodo) {
        List res = AplicacionDePago.findAll(
                """
                
                    from AplicacionDePago a 
                        where a.cxp.proveedor = ? 
                        and a.fecha  between ? and ?
                """,
                [proveedor, periodo.fechaInicial, periodo.fechaFinal])
        def data = res.collect {
            new EstadoDeCuentaRow(
                    it.id, 
                    it.cxp.nombre, 
                    it.cxp.serie, 
                    it.cxp.folio, 
                    it.tipo, 
                    it.fecha, 
                    it.cxp.moneda, 
                    it.cxp.tipoDeCambio, 
                    it.importe * -1, 
                    it.formaDePago
                    )  
        }
        return data
    }
}
