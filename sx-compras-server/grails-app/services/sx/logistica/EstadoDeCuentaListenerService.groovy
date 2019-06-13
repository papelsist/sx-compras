package sx.logistica

import grails.compiler.GrailsCompileStatic
import grails.events.annotation.gorm.Listener

import groovy.util.logging.Slf4j

import org.grails.datastore.mapping.engine.event.AbstractPersistenceEvent
import org.grails.datastore.mapping.engine.event.EventType
import org.grails.datastore.mapping.engine.event.PostDeleteEvent
import org.grails.datastore.mapping.engine.event.PostInsertEvent
import org.grails.datastore.mapping.engine.event.PostUpdateEvent

import sx.core.LogUser
import sx.cxc.AplicacionDeCobro


@Slf4j
@GrailsCompileStatic
class EstadoDeCuentaListenerService implements  LogUser{

    @Listener([FacturistaOtroCargo, FacturistaPrestamo, AplicacionDeCobro])
    void onPostInsertEvent(PostInsertEvent event) {
        registrar(event)
    }


    @Listener([FacturistaOtroCargo, FacturistaPrestamo])
    void onPostUpdateEvent(PostUpdateEvent event) {
        registrar(event)
    }

    @Listener([FacturistaOtroCargo, FacturistaPrestamo, AplicacionDeCobro])
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
            if(event instanceof PostDeleteEvent) {
                log.debug('Eliminar cargo del estado de cuenta')
                eliminarCargo(cargo)
            }
        }

        if(event.entityObject instanceof FacturistaPrestamo) {
            FacturistaPrestamo prestamo = event.entityObject as FacturistaPrestamo
            registrarPrestamo(prestamo)
        }
        if(event.entityObject instanceof AplicacionDeCobro) {
            AplicacionDeCobro aplicacion = event.entityObject as AplicacionDeCobro
            atenderAplicacion(aplicacion, event)
        }
    }

    private registrarPrestamo(FacturistaPrestamo prestamo) {
        log.info('Registrando prestamo: {}', prestamo)
        FacturistaEstadoDeCuenta mov = FacturistaEstadoDeCuenta
                .where{facturista == prestamo.facturista && origen == prestamo.id.toString() && tipo == 'PRESTAMO'}.find()

        FacturistaEstadoDeCuenta last = FacturistaEstadoDeCuenta.where{
            facturista == prestamo.facturista &&
                    origen != prestamo.id.toString()
        }.find([sort:'dateCreated', order: 'desc'])

        BigDecimal saldoAnterior = last ? last.saldo : 0.0
        BigDecimal saldo = saldoAnterior + prestamo.importe
        if(!mov) {
            log.info('Generando MOV...')
            mov = new FacturistaEstadoDeCuenta(
                    facturista: prestamo.facturista,
                    nombre: prestamo.facturista.nombre,
                    origen: prestamo.id.toString(),
                    tipo: 'PRESTAMO',
                    importe: prestamo.importe,
                    saldo: saldo,
                    concepto: prestamo.tipo,
                    comentario: prestamo.comentario,
                    fecha: prestamo.fecha
            )
        } else {
            log.info('Mov existente: {}', mov)
            mov.importe = prestamo.importe
            mov.saldo = saldo
        }
        logEntity(mov)
        mov.save()
    }

    private registrarCargo(FacturistaOtroCargo otroCargo) {
        FacturistaEstadoDeCuenta mov = FacturistaEstadoDeCuenta
                .where{facturista == otroCargo.facturista && origen == otroCargo.id.toString() && tipo == 'OTROS_CARGOS'}.find()

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

    private eliminarCargo(FacturistaOtroCargo otroCargo) {
        FacturistaEstadoDeCuenta.withNewTransaction {
            FacturistaEstadoDeCuenta mov = FacturistaEstadoDeCuenta
                    .where{facturista == otroCargo.facturista && origen == otroCargo.id.toString() && tipo == 'OTROS_CARGOS'}.find()

            if(mov) {
                log.debug("Eliminando registro de estado de cuenta ${}", mov.id)
                mov.delete flush: true
            }
        }

    }


    private atenderAplicacion(AplicacionDeCobro aplicacion, AbstractPersistenceEvent event) {
        if(aplicacion.cobro.tipo == 'CHO') {
            if(event.eventType == EventType.PostDelete) {
                log.info("Eliminando abono cancelacion de apliacion: {}", aplicacion.id)
                eliminarAbono(aplicacion)
            } else {
                registrarAbono(aplicacion)
            }
        }
    }

    private registrarAbono(AplicacionDeCobro a) {

        log.info('Registrando abono en estado de cuenta aplicacion: {}', a.id)
        FacturistaDeEmbarque f = FacturistaDeEmbarque.where{rfc == a.cobro.cliente.rfc}.find()
        FacturistaEstadoDeCuenta.withNewSession {
            FacturistaEstadoDeCuenta mov = FacturistaEstadoDeCuenta.where{ origen == a.id}.find()
            BigDecimal importe = a.importe * - 1.0
            if(!mov) {
                mov = new FacturistaEstadoDeCuenta(
                        facturista: f,
                        nombre: f.nombre,
                        origen: a.id,
                        tipo: 'ABONO',
                        concepto: a.cuentaPorCobrar.tipoDocumento,
                        comentario: a.cobro.comentario,
                        fecha: a.fecha
                )
            }
            mov.importe = importe
            mov.saldo = 0.0
            logEntity(mov)
            mov.save(flush: true)
        }

    }

    private eliminarAbono(AplicacionDeCobro a) {
        FacturistaEstadoDeCuenta.withNewSession {
            FacturistaEstadoDeCuenta row = FacturistaEstadoDeCuenta.where{ origen == a.id}.find()
            if(row) {
                row.delete flush: true
            }
        }
    }


}
