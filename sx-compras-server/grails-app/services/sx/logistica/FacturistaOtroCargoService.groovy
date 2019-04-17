package sx.logistica

import groovy.util.logging.Slf4j
import sx.core.Cliente
import sx.core.LogUser
import sx.core.Sucursal
import sx.cxc.CuentaPorCobrar

@Slf4j
class FacturistaOtroCargoService implements  LogUser{

    FacturistaOtroCargo save(FacturistaOtroCargo cargo) {
        logEntity(cargo)
        cargo = cargo.save failOnError: true, flush: true
        CuentaPorCobrar cxc = cargo.cxc
        cxc.documento = cargo.id
        return cargo
    }

    FacturistaOtroCargo update(FacturistaOtroCargo cargo) {

        CuentaPorCobrar cxc = cargo.cxc
        cxc.comentario = cargo.comentario
        cxc.importe = cargo.importe
        cxc.total = cargo.importe
        cxc.fecha = cargo.fecha
        logEntity(cargo)
        cargo.save failOnError: true, flush: true
    }

    CuentaPorCobrar generarCuentaPorCobrar(FacturistaOtroCargo cargo) {
        Cliente cliente = Cliente.where{rfc == cargo.facturista.proveedor.rfc}.find()
        Sucursal suc = Sucursal.where{nombre == 'OFICINAS'}.find()
        if(!cliente)
            throw new RuntimeException("Facturista ${cargo.facturista.nombre} sin cliente dado de alta")

        CuentaPorCobrar cxc = new CuentaPorCobrar(
                cliente: cliente,
                nombre: cliente.nombre,
                tipo: 'CHO',
                tipoDocumento: 'OTROS',
                importe: cargo.importe,
                impuesto: 0.0,
                total: cargo.importe,
                sucursal: suc,
                fecha: cargo.fecha,
                formaDePago: 'TRANSFERENCIA',
                comentario: "${cargo.tipo} ${cargo.comentario}" ,
        )
        logEntity(cxc)
        return cxc

    }

    void deletePrestamo(FacturistaOtroCargo cargo) {
        CuentaPorCobrar cxc = cargo.cxc
        cargo.cxc = null
        cargo.delete flush: true
        cxc.delete flush: true

    }
}
