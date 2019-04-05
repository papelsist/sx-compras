package sx.logistica

import groovy.util.logging.Slf4j
import sx.core.Cliente
import sx.core.LogUser
import sx.core.Sucursal
import sx.cxc.CuentaPorCobrar

@Slf4j
class FacturistaPrestamoService implements  LogUser{

    FacturistaPrestamo save(FacturistaPrestamo prestamo) {
        logEntity(prestamo)
        prestamo = prestamo.save failOnError: true, flush: true
        CuentaPorCobrar cxc = prestamo.cxc
        cxc.documento = prestamo.id
        return prestamo
    }

    FacturistaPrestamo update(FacturistaPrestamo prestamo) {

        CuentaPorCobrar cxc = prestamo.cxc
        cxc.comentario = prestamo.comentario
        cxc.importe = prestamo.importe
        cxc.total = prestamo.importe
        cxc.fecha = prestamo.fecha
        logEntity(prestamo)
        prestamo.save failOnError: true, flush: true
    }

    CuentaPorCobrar generarCuentaPorCobrar(FacturistaPrestamo prestamo) {
        Cliente cliente = Cliente.where{rfc == prestamo.facturista.proveedor.rfc}.find()
        Sucursal suc = Sucursal.where{nombre == 'OFICINAS'}.find()
        if(!cliente)
            throw new RuntimeException("Facturista ${prestamo.facturista.nombre} sin cliente dado de alta")

        CuentaPorCobrar cxc = new CuentaPorCobrar(
                cliente: cliente,
                nombre: cliente.nombre,
                tipo: 'CHO',
                tipoDocumento: 'PRESTAMO',
                importe: prestamo.importe,
                impuesto: 0.0,
                total: prestamo.importe,
                sucursal: suc,
                fecha: prestamo.fecha,
                formaDePago: 'TRANSFERENCIA',
                comentario: prestamo.comentario,
        )
        logEntity(cxc)
        return cxc

    }

    void deletePrestamo(FacturistaPrestamo prestamo) {
        CuentaPorCobrar cxc = prestamo.cxc
        prestamo.cxc = null
        prestamo.delete flush: true
        cxc.delete flush: true

    }
}
