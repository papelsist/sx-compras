package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.gorm.Listener
import groovy.util.logging.Slf4j
import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent




@Slf4j
@GrailsCompileStatic
class NotaDeCreditoListenerService {

    @Listener([AplicacionDeCobro])
    void onPostInsertEvent(PostInsertEvent event) {
        registrar(event)
    }

    @Listener([AplicacionDeCobro])
    void onPostDelete(PostDeleteEvent event) {
        registrar(event)
    }


    private void registrar(AbstractPersistenceEvent event) {

        if(event.entityObject instanceof AplicacionDeCobro) {
            AplicacionDeCobro aplicacion = event.entityObject as AplicacionDeCobro
            actualizarSaldo(aplicacion)
        }
    }

    private actualizarSaldo(AplicacionDeCobro aplicacion) {
        log.info('Aplicacion de cobro detectada para CxC: {}', aplicacion.cuentaPorCobrar.id)
    }
}
