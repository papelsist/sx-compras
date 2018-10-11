package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.RestfulController
import grails.validation.Validateable
import groovy.util.logging.Slf4j
import sx.cxp.Requisicion
import sx.cxp.RequisicionDeCompras

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
        log.info("Pago: {}", command)
        Requisicion requisicion = pagoDeRequisicionService.pagar(command)
        respond command.requisicion
    }

    def cancelarPago(Requisicion requisicion) {
        if(requisicion == null) {
            respond status: NOT_FOUND
            return
        }
        pagoDeRequisicionService.cancelarPago(requisicion)
        [requisicion: requisicion]
    }

    def generarCheque() {
        log.info('Genera cheque {}', params)
        Requisicion requisicion = pagoDeRequisicionService.generarCheque(params.id.toString())
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
}

class PagoDeRequisicion implements  Validateable{
    Requisicion requisicion
    CuentaDeBanco cuenta
    String referencia

    String toString() {
        return "Pago de requisicion ${requisicion.folio} Cuenta: ${cuenta?.clave}  Referencia ${referencia}"
    }

    static constraints =  {
        referencia nullable: true
    }
}

class CancelacionDeCheque implements  Validateable{
    Requisicion requisicion
    String comentario

    String toString() {
        return "Cancelacion de cheque ${requisicion.folio} Comentario: ${comentario}"
    }

    static constraints =  {
        comentario nullable: true
    }
}
