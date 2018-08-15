package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.plugin.springsecurity.annotation.Secured
import grails.rest.*


@Secured("ROLE_COMPRAS")
@GrailsCompileStatic
class AplicacionDePagoController extends RestfulController<AplicacionDePago> {

    static responseFormats = ['json']
    AplicacionDePagoService aplicacionDePagoService

    AplicacionDePagoController() {
        super(AplicacionDePago)
    }


    def delete(AplicacionDePago aplicacionDePago) {
        if(handleReadOnly()) {
            return
        }

        if (aplicacionDePago == null) {
            notFound()
            return
        }
        // log.debug('Eliminando aplicacion de pago: {}', aplicacionDePago)
        aplicacionDePagoService.delete(aplicacionDePago.id)

        if(aplicacionDePago.nota) {
            NotaDeCreditoCxP nota = aplicacionDePago.nota
            forward controller: 'notaDeCreditoCxP', action: 'show', id: nota.id
            return
        } else {
            Pago pago = aplicacionDePago.pago
            respond pago
            return

        }
    }

    def save(AplicacionDePago aplicacionDePago) {
        if(handleReadOnly()) {
            return
        }

        if (aplicacionDePago == null) {
            notFound()
            return
        }
        // log.debug('Agregando aplicacion de pago: {}', aplicacionDePago)
        if(aplicacionDePago.nota) {
            aplicacionDePagoService.saveAplicacionDeNota(aplicacionDePago)
            NotaDeCreditoCxP nota = aplicacionDePago.nota
            nota.refresh()
            forward controller: 'notaDeCreditoCxP', action: 'show', id: nota.id
            return
        } else {
            Pago pago = aplicacionDePago.pago
            respond pago
            return

        }

    }
}
