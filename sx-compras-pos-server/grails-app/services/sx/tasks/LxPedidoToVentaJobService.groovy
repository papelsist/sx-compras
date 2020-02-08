package sx.tasks

import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import grails.util.Environment
import grails.gorm.transactions.Transactional

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.beans.factory.annotation.Value

import org.apache.commons.lang3.exception.ExceptionUtils

import sx.cloud.LxVentaService

@Slf4j
@Transactional
class LxPedidoToVentaJobService {

    boolean lazyInit = false

    LxVentaService lxVentaService
    
    /**
    * Se puede arrancar con -Dfirebase.sync=true|false
    */
    @Value('${firebase.sync}')
    boolean activo = false
    

    @Scheduled(fixedDelay = 60000L, initialDelay = 30000L)
    void lxPedidoToVenta() {
        Environment.executeForCurrentEnvironment {
            if(activo) {
                Date start = new Date()
                production {
                    log.debug('Descargando pedidos desde Firebase para generar ventas Start:{}', start)
                   // lxVentaService.ventaCreate()
                }
                development {
                    log.debug('Descargando pedidos desde FireBase [DEV] para generar ventas Start: {}', start)
                  //  lxVentaService.ventaCreate()
                }
            }

        }

    }
    
}
