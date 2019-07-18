package sx.cxp

import grails.events.annotation.Subscriber
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import sx.core.Proveedor
import sx.utils.Periodo
import sx.utils.MonedaUtils

// @Transactional
@Slf4j
class CuentaPorPagarService {

    List<CuentaPorPagar> buscarFacturas(String proveedorId, Periodo periodo) {
        return CuentaPorPagar.findAll("from CuentaPorPagar where fecha between ? and ? and proveedor.id = ?",
            [periodo.fechaInicial, periodo.fechaFinal, proveedorId])
    }

    EstadoDeCuentaProveedor estadoDeCuenta(Proveedor proveedor, Periodo periodo) {
        log.info('Calculando estado de cuenta para {} Periodo: {}', proveedor.nombre, periodo)
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

        def saldo = estado.saldoInicial
        movimientos.each {
            saldo += it.importe
            it.saldo = saldo
        }
        
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
            def importe = it.importe
            if(it.pago) {
                importe = importe * it.pago.tipoDeCambio
            } else if (it.nota) {
                importe = importe * it.nota.tipoDeCambio
            }
            importe = MonedaUtils.round(importe)
            def row = new EstadoDeCuentaRow(
                    it.id, 
                    it.cxp.nombre, 
                    it.cxp.serie, 
                    it.cxp.folio, 
                    it.tipo, 
                    it.fecha, 
                    it.cxp.moneda, 
                    it.cxp.tipoDeCambio, 
                    importe * -1, 
                    it.formaDePago
                    )  
            if(it.nota) {
                row.tipo = "${it.tipo} ${it.nota.serie} ${it.nota.folio}"
                row.comentario = "${it.nota.comentario} "
            }
            return row
        }
        return data
    }
}
