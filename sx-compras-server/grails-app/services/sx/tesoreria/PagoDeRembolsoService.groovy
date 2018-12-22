package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.core.LogUser

import sx.cxp.PagoDeRembolso
import sx.cxp.PagoService
import sx.cxp.Rembolso


@Transactional
@GrailsCompileStatic
@Slf4j
class PagoDeRembolsoService implements  LogUser {

    MovimientoDeCuentaService movimientoDeCuentaService

    PagoService pagoService

    /**
     * Paga la rembolso lo que implca:
     *
     *  Generacion del MovimientoDeCuenta
     *
     * @param rembolso El rembolso que se desea pagar
     * @param cuenta La cuenta de banco que fondea la operacion
     * @param referencia La referencia bancaria correspondiente
     *
     * @return El rembolso pagado
     */
    @CompileDynamic
    Rembolso pagar(PagoDeRembolso command) {

        Rembolso rembolso = command.rembolso
        CuentaDeBanco cuenta = command.cuenta
        String referencia = command.referencia


        log.info("Pagando rembolso {}", rembolso.id)
        if(rembolso.egreso != null)
            throw new PagoDeRembolsoException("Rembolso ${rembolso.id} ya está pagado con el egreso ${rembolso.egreso}")
        if(!rembolso.partidas) {
            throw new PagoDeRembolsoException("Rembolso ${rembolso.id} no tiene documentos por pagar")
        }


        if(command.importe > 0) {
            rembolso.comentario = "PAGO MODIFICADO ORIGINAL DE:${rembolso.apagar}"
            rembolso.apagar = command.importe
            log.info('Pago re rembolso {} ajustado a {}', rembolso.id, rembolso.apagar)
        }

        MovimientoDeCuenta egreso = movimientoDeCuentaService.generarEgreso(rembolso, cuenta, referencia)
        rembolso.egreso = egreso
        if(egreso.formaDePago == 'CHEQUE'){
            generarCheque(rembolso)
        }
        egreso.save(flush: true)
        log.info('Egreso generado {}', egreso.importe)
        logEntity(rembolso)
        rembolso = rembolso.save flush: true
        return rembolso

    }

    Rembolso cancelarPago(Rembolso rembolso) {
        if(!rembolso.egreso ) {
            throw new PagoDeRembolsoException("El rembolso no se ha pagado")
        }
        MovimientoDeCuenta egreso = rembolso.egreso
        rembolso.egreso = null
        Cheque cheque = egreso.cheque
        if(cheque) {
            egreso.cheque = null
            cheque.delete flush: true
        }
        egreso.delete flush: true
        rembolso.save flush: true
        return rembolso
    }

    Rembolso generarCheque( Rembolso rembolso) {
        MovimientoDeCuenta egreso = rembolso.egreso
        if(!egreso.cheque) {
            log.info('Generando cheque para egreso: {}', egreso)
            movimientoDeCuentaService.generarCheque(egreso)
            logEntity(egreso)
            egreso.save()
        }
        return rembolso

    }

    Rembolso cancelarCheque(Rembolso rembolso, String comentario = 'CANCELACION') {

        MovimientoDeCuenta egreso = rembolso.egreso
        Cheque cheque = egreso.cheque
        if(cheque) {
            cheque.egreso = null
            cheque.cancelado = new Date()
            cheque.canceladoComentario = comentario
            logEntity(cheque)
            cheque.save flush: true

            egreso.cheque = null
            egreso.save flush: true
            rembolso.refresh()
        }
        return rembolso

    }




}

class PagoDeRembolsoException extends  RuntimeException {

    PagoDeRembolsoException(String message){
        super(message)
    }
}

