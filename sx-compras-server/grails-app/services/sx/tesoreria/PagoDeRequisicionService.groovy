package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.core.LogUser
import sx.cxp.AplicacionDePago
import sx.cxp.Pago
import sx.cxp.PagoService
import sx.cxp.Requisicion
import sx.cxp.RequisicionDeCompras

@Transactional
@GrailsCompileStatic
@Slf4j
class PagoDeRequisicionService implements  LogUser {

    MovimientoDeCuentaService movimientoDeCuentaService

    PagoService pagoService

    /**
     * Paga la requisicion lo que implca:
     *
     *  Generacion del MovimientoDeCuenta
     *  Generacion del Pago
     *  Generacion de las aplicaciones de pago AplicacionDePago
     *
     * @param requisicion La requisicion que se desea pagar
     * @param cuenta La cuenta de banco que fondea la operacion
     * @param referencia La referencia bancaria correspondiente
     *
     * @return La Requisicion con las referencias apropiadas
     */
    @CompileDynamic
    Requisicion pagar(PagoDeRequisicion command) {

        Requisicion requisicion = command.requisicion
        CuentaDeBanco cuenta = command.cuenta
        String referencia = command.referencia


        log.info("Pagando requisicion {}", requisicion.folio)
        if(requisicion.egreso != null)
            throw new PagoDeRequisicionException("Requisicion ${requisicion.folio} ya está pagada con el egreso ${requisicion.egreso}")
        if(!requisicion.partidas) {
            // throw new PagoDeRequisicionException("Requisicion ${requisicion.folio} no tiene documentos por pagar")
        }
        if(!requisicion.cerrada) {
            // throw new PagoDeRequisicionException("Requisicion ${requisicion.folio} no no esta cerrada")
        }

        String tipo  = requisicion.instanceOf(RequisicionDeCompras) ? 'COMRA' : 'GASTO'
        if(command.importe > 0) {
            requisicion.comentario = "PAGO MODIFICADO ORIGINAL DE:${requisicion.apagar}"
            requisicion.apagar = command.importe
            log.info('Pago re requisicion {} ajustado a {}', requisicion.folio, requisicion.apagar)
        }

        MovimientoDeCuenta egreso = movimientoDeCuentaService.generarEgreso(requisicion, tipo, tipo, cuenta, referencia)
        requisicion.egreso = egreso
        requisicion.pagada = egreso.fecha
        log.info('Egreso generado {}', egreso.importe)

        if(requisicion.formaDePago == 'TRANSFERENCIA') {
            MovimientoDeCuenta comision = movimientoDeCuentaService.generarComisionPorTransferencia(requisicion)
            if(comision) {
                requisicion.comision = comision
                log.info("Comision por transrerencia  generada ${comision.importe}")
            }
        }

        Pago pago = pagoService.pagar(requisicion)
        if(pago.disponible > 0)
            pagoService.aplicarPago(pago)

        return requisicion.save(flush: true)

    }

    Requisicion cancelarPago(Requisicion requisicion) {
        if(!requisicion.egreso ) {
            throw new PagoDeRequisicionException("La requisicion no se ha pagado")
        }

        MovimientoDeCuenta egreso = requisicion.egreso
        requisicion.egreso = null

        if(egreso.cheque) {
            Cheque cheque = egreso.cheque
            egreso.cheque = null
            if(cheque.impresion) {
                cheque.egreso = null
                cheque.cancelado = cheque.fecha
                cheque.canceladoComentario = "CANCELADO ${cheque.cancelado.format('dd/MM/yyyy')}"
                cheque.save flush: true
            }else
                cheque.delete flush: true
        }
        egreso.delete flush: true

        if(requisicion.comision) {
            MovimientoDeCuenta comision = requisicion.comision
            requisicion.comision = null
            comision.delete flush: true
        }

        cancelarPagoCxP(requisicion)
        requisicion.save flush: true
        return requisicion
    }

    void cancelarPagoCxP(Requisicion requisicion){
        Pago pago = Pago.where{requisicion == requisicion}.find()
        if(pago) {
            // Eliminar las aplicaciones
            AplicacionDePago.executeUpdate('delete from AplicacionDePago p where p.pago = ?', [pago])
            requisicion.pagada = null
            requisicion.aplicada = null
            pago.delete flush: true
        }
    }

    Requisicion generarCheque( String requisicionId, String referencia) {
        Requisicion requisicion = Requisicion.get(requisicionId)

        if(!requisicion.egreso || requisicion.egreso.formaDePago != 'CHEQUE') {
            throw new ChequeException("La requisicion no esta pagada con CHEQUE")
        }

        MovimientoDeCuenta egreso = requisicion.egreso
        egreso.referencia = referencia
        movimientoDeCuentaService.generarCheque(egreso)
        logEntity(egreso)
        egreso.save failOnError: true, flush: true
        log.info('Cheque: {} genewrado paraa egreso: {}', egreso.cheque, egreso.id)
        requisicion.refresh()
        return requisicion

    }

    Requisicion cancelarCheque(CancelacionDeCheque canclacion) {
        Requisicion requisicion = canclacion.requisicion
        if(!requisicion.egreso || requisicion.egreso.formaDePago != 'CHEQUE') {
            throw new CancelacionDeChequeException("La requisicion no esta pagada con CHEQUE")
        }
        if(requisicion.egreso.cheque == null) {
            throw new CancelacionDeChequeException("No se ha generado el cheque de la requisicion ${requisicion.folio}")
        }

        MovimientoDeCuenta egreso = requisicion.egreso
        Cheque cheque = egreso.cheque

        cheque.egreso = null
        cheque.cancelado = canclacion.fecha
        cheque.canceladoComentario = "CANCELADO ${cheque.cancelado.format('dd/MM/yyyy')}" // canclacion.comentario
        cheque.save flush: true

        egreso.cheque = null
        egreso.save flush: true

        logEntity(cheque)

        requisicion.refresh()
        return requisicion

    }


}

class PagoDeRequisicionException extends  RuntimeException {

    PagoDeRequisicionException(String message){
        super(message)
    }
}

class ChequeException extends RuntimeException{

    ChequeException(String message) {
        super(message)

    }
}

class CancelacionDeChequeException extends RuntimeException{

    CancelacionDeChequeException(String message) {
        super(message)

    }
}
