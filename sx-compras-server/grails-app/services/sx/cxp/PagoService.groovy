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

    Pago pagar(Requisicion requisicion) {
        return generarPagoDeRequisicion(requisicion)
    }

    @CompileDynamic
    Pago generarPagoDeRequisicion(Requisicion requisicion) {
        Pago found = Pago.where{requisicion.id == requisicion.id}.find()
        if(found)
            throw new RuntimeException("Ya existe el pago: ${found.id} para la  requisicion ${requisicion.folio}")

        String serie = requisicion.class.simpleName
        Pago pago = new Pago()
        pago.proveedor = requisicion.proveedor
        pago.nombre = requisicion.nombre
        pago.fecha = requisicion.fecha
        pago.formaDePago = requisicion.formaDePago
        pago.egreso = requisicion.egreso
        pago.moneda = requisicion.moneda
        pago.total = requisicion.apagar
        pago.tipoDeCambio = requisicion.tipoDeCambio
        pago.folio = requisicion.folio
        pago.serie = serie
        pago.requisicion = requisicion

        logEntity(pago)
        pago.createUser = requisicion.createUser
        pago.updateUser = requisicion.updateUser
        pago =  save(pago)
        log.info("Pago generado ${pago.id}")
        return pago

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
    Pago aplicarPago(Pago pago) {
        // Pago pago = Pago.get(pagoId)
        Requisicion requisicion = pago.requisicion
        if(requisicion) {
            requisicion.partidas.each { RequisicionDet det ->
                BigDecimal importe = det.apagar
                AplicacionDePago apl = new AplicacionDePago(
                        pago: pago,
                        fecha: requisicion.fechaDePago,
                        cxp: det.cxp,
                        importe: importe,
                        comentario: "Pago de Requisicion ${requisicion.folio}",
                        formaDePago: requisicion.formaDePago
                )
                apl.save flush: true
            }
            requisicion.aplicada = requisicion.fechaDePago
            requisicion.save flush: true
            pago.refresh()
            logEntity(pago)
            log.info("Pago {} aplicado disponible: {}", pago.folio, pago.disponible)
        }
        return pago
    }

}


