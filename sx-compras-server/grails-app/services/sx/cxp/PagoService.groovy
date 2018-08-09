package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Service(Pago)
abstract class PagoService implements  LogUser{

    // @Autowired AplicacionDePagoService aplicacionDePagoService

    abstract  Pago save(Pago pago)

    abstract void delete(Serializable id)

    @CompileDynamic
    Pago generarPagoDeRequisicion(String requisicionId) {
        Pago found = Pago.where{requisicion.id == requisicionId}.find()
        if(found)
            throw new RuntimeException("Ya existe el pago: ${found.folio} de la requisicion")

        Requisicion requisicion = Requisicion.get(requisicionId)
        String serie = requisicion.class.simpleName
        Pago pago = new Pago()
        pago.proveedor = requisicion.proveedor
        pago.nombre = requisicion.nombre
        pago.fecha = requisicion.fecha
        pago.formaDePago = requisicion.formaDePago
        pago.egreso = requisicion.egreso
        pago.moneda = requisicion.moneda
        pago.total = requisicion.total
        pago.tipoDeCambio = requisicion.tipoDeCambio
        pago.folio = requisicion.folio
        pago.serie = serie
        pago.requisicion = requisicion

        logEntity(pago)
        pago.createUser = requisicion.createUser
        pago.updateUser = requisicion.updateUser
        requisicion.pagada = pago.fecha
        return save(pago)

    }

    void cancelarPago(String pagoId){
        Pago pago = Pago.get(pagoId)
        // Eliminar las aplicaciones
        AplicacionDePago.executeUpdate('delete from AplicacionDePago p where p.pago = ?', [pago])

        // Actualizar requisicion
        Requisicion requisicion = pago.requisicion
        if(requisicion) {
            requisicion.pagada = null
            requisicion.aplicada = null
            requisicion.save flush: true
        }
        // Eliminar el pago
        delete(pago.id)
    }


    @CompileDynamic
    Pago aplicarPago(String pagoId) {
        Pago pago = Pago.get(pagoId)
        Requisicion requisicion = pago.requisicion
        if(requisicion) {
            BigDecimal disponible = pago.getDisponible()
            List<AplicacionDePago> aplicaciones = []
            List<CuentaPorPagar> facturas = requisicion.partidas
                    .collect { RequisicionDet det -> det.cxp}
                    .findAll {CuentaPorPagar cxp -> cxp.getSaldo() > 0.0}

            facturas.each { CuentaPorPagar cxp ->
                BigDecimal saldo = cxp.getSaldo()
                BigDecimal importe = saldo <= disponible ? saldo : disponible
                disponible = disponible - importe
                AplicacionDePago apl = new AplicacionDePago(
                        pago: pago,
                        fecha: requisicion.fechaDePago,
                        cxp: cxp,
                        importe: importe,
                        comentario: "Pago de Requisicion ${requisicion.folio}",
                        formaDePago: requisicion.formaDePago
                )
                // aplicaciones << aplicacionDePagoService.save(apl)
                apl.save flush: true
                aplicaciones << apl
            }
            requisicion.aplicada = requisicion.fechaDePago
            requisicion.save flush: true
            pago.refresh()
        }
        return pago
    }

}


