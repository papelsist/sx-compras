package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
import sx.core.LogUser

@Transactional
@GrailsCompileStatic
@Slf4j
class CobroService implements  LogUser{

    Cobro save( Cobro cobro) {
        log.info('Salvando cobro: {}', cobro)
        if(cobro.cheque) {
            cobro.cheque.nombre = cobro.cliente.nombre
        }
        logEntity(cobro)
        setComisiones(cobro)
        cobro.save failOnError: true, fluhs: true
    }

    Cobro update(Cobro cobro) {
        log.info('Actualizando cobro {}', cobro)
        if(cobro.formaDePago != 'CHEQUE' && (cobro.cheque != null)) {

            CobroCheque cobroCheque = cobro.cheque
            log.info('Quitando el cheque relacionado {}', cobroCheque.id)

            cobro.cheque = null
            cobroCheque.delete flush: true
        }
        if(!cobro.formaDePago.startsWith('TARJETA') && cobro.tarjeta) {
            CobroTarjeta tarjeta = cobro.tarjeta
            cobro.tarjeta = null
            tarjeta.delete flush: true
            log.info('Cobro tarjeta relacionado {} eliminado', tarjeta.id)
        }
        logEntity(cobro)
        setComisiones(cobro)
        cobro.save failOnError: true, fluhs: true
    }

    private setComisiones(Cobro cobro) {
        if (cobro.tarjeta) {
            if(cobro.tarjeta.debitoCredito) {
                cobro.tarjeta.comision = 1.46
            } else if (cobro.tarjeta.visaMaster) {
                cobro.tarjeta.comision = 2.36
            } else {
                cobro.tarjeta.comision = 3.80
            }
        }
    }
}
