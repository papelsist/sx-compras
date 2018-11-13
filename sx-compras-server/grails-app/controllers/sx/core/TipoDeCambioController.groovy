package sx.core

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*
import grails.validation.Validateable
import groovy.util.logging.Slf4j

@Slf4j
@GrailsCompileStatic
@Secured("ROLE_TESORERIA")
class TipoDeCambioController extends RestfulController {

    static responseFormats = ['json']

    TipoDeCambioController() {
        super(TipoDeCambio)
    }

    @Secured("IS_AUTHENTICATED_ANONYMOUSLY")
    def buscar(TipoDeCambioCommand command) {
        if(command == null){
            notFound()
            return
        }
        command.validate()
        if(command.hasErrors()){
            respond command.errors, view:'create' // STATUS CODE 422
            return
        }
        TipoDeCambio tipoDeCambio = TipoDeCambio.where{ moneda == command.moneda && fecha == command.fecha}.find()
        if(tipoDeCambio == null){
            log.info('No encontro tipo de cambio para la fecha: {}, moneda: {}', command.fecha, command.moneda)
            notFound()
            return
        }
        respond tipoDeCambio
    }
}
class TipoDeCambioCommand implements  Validateable {
    String moneda
    Date fecha
}
