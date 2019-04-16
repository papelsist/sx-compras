package sx.logistica

import grails.events.annotation.gorm.Listener

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent

import sx.core.LogUser



@Slf4j
// @CompileStatic
class FacturistaEstadoDeCuentaService implements  LogUser{

    // @Listener(FacturistaOtroCargo)
    void onPostInsertEvent(PostInsertEvent event) {
        registrar(event)
    }


    // @Listener(FacturistaOtroCargo)
    void onPostUpdateEvent(PostUpdateEvent event) {
        registrar(event)
    }

    // @Listener(FacturistaOtroCargo)
    void onPostDelete(PostDeleteEvent event) {
        registrar(event)
    }


    private void registrar(AbstractPersistenceEvent event) {
        // println 'Event: ' + event
        if (event.entityObject instanceof FacturistaOtroCargo) {
            FacturistaOtroCargo cargo = event.entityObject as FacturistaOtroCargo
            if(event instanceof PostInsertEvent) {
                log.info('Generar ingreso en movimiento de cuenta para {}', cargo)
                registrarCargo(cargo)
            }
            if(event instanceof  PostUpdateEvent) {
                log.info('Actualizar estado de cuenta.....{}', cargo)
                registrarCargo(cargo)
            }
        }
    }

    private registrarCargo(FacturistaOtroCargo otroCargo) {
        FacturistaEstadoDeCuenta mov = FacturistaEstadoDeCuenta
                .where{facturista == otroCargo.facturista && origen == otroCargo.id.toString()}.find()

        FacturistaEstadoDeCuenta last = FacturistaEstadoDeCuenta.where{
            facturista == otroCargo.facturista &&
            origen != otroCargo.id.toString()
        }.find([sort:'dateCreated', order: 'desc'])

        BigDecimal saldoAnterior = last ? last.saldo : 0.0
        BigDecimal saldo = saldoAnterior + otroCargo.importe
        if(!mov) {
            mov = new FacturistaEstadoDeCuenta(
                    facturista: otroCargo.facturista,
                    nombre: otroCargo.facturista.nombre,
                    origen: otroCargo.id.toString(),
                    tipo: 'OTROS_CARGOS',
                    importe: otroCargo.importe,
                    saldo: saldo,
                    concepto: otroCargo.tipo,
                    comentario: otroCargo.comentario,
                    fecha: otroCargo.fecha
            )
        } else {
            mov.importe = otroCargo.importe
            mov.saldo = saldo
        }
        logEntity(mov)
        mov.save()
    }


}
