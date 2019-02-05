package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured

import grails.validation.Validateable
import groovy.util.logging.Slf4j
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.cxp.Requisicion


import static org.springframework.http.HttpStatus.NOT_FOUND

@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
@Slf4j
class PagoDeRequisicionController {

    static responseFormats = ['json']

    PagoDeRequisicionService pagoDeRequisicionService

    PagoDeRequisicionController() {

    }

    def pagar(PagoDeRequisicion command) {
        if(command == null) {
            respond status: NOT_FOUND
            return
        }
        if(command.hasErrors()) {
            respond(command.errors, status: 422)
            return
        }
        Requisicion requisicion = pagoDeRequisicionService.pagar(command)
        requisicion.refresh()
        log.info('Requisicion pagada: {} Egreso: {} Cheque: {}', requisicion.folio, requisicion.egreso, requisicion.egreso.cheque ?: '')
        respond requisicion
    }

    def cancelarPago(Requisicion requisicion) {
        if(requisicion == null) {
            respond status: NOT_FOUND
            return
        }
        requisicion = pagoDeRequisicionService.cancelarPago(requisicion)
        log.info('Requisicion con pago cancelado {}', requisicion.folio)
        [requisicion: requisicion]
    }

    def generarCheque() {
        log.info('Genera cheque {}', params)
        String id = params.id.toString()
        String referencia = params.referencia.toString()
        Requisicion requisicion = pagoDeRequisicionService
                .generarCheque(id, referencia)
        [requisicion: requisicion]
    }

    def cancelarCheque(CancelacionDeCheque command) {
        if(command == null) {
            respond status: NOT_FOUND
            return
        }
        if(command.hasErrors()) {
            respond(command.errors, status: 422)
            return
        }
        Requisicion requisicion = pagoDeRequisicionService.cancelarCheque(command)
        log.info("Cheque de pago cancelado para la requisicion: {} ", requisicion.folio)
        [requisicion: requisicion]
    }

    def handleException(Exception e) {
        String message = ExceptionUtils.getRootCauseMessage(e)
        log.error(message, ExceptionUtils.getRootCause(e))
        respond([message: message], status: 500)
    }
}

class PagoDeRequisicion implements  Validateable{
    Requisicion requisicion
    CuentaDeBanco cuenta
    String referencia
    BigDecimal importe

    String toString() {
        return "Pago de requisicion ${requisicion.folio} Cuenta: ${cuenta?.clave}  Referencia ${referencia}"
    }

    static constraints =  {
        referencia nullable: true
        importe nullable: true
    }
}

class CancelacionDeCheque implements  Validateable{
    Requisicion requisicion
    Date fecha = new Date()
    String comentario

    String toString() {
        return "Cancelacion de cheque ${requisicion.folio} Comentario: ${comentario}"
    }

    static constraints =  {
        comentario nullable: true
    }
}
