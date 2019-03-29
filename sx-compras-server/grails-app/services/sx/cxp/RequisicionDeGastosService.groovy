package sx.cxp


import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional

import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.core.FolioLog
import sx.core.LogUser

@Transactional
@GrailsCompileStatic
@Slf4j
class RequisicionDeGastosService implements LogUser, FolioLog{


    RequisicionDeGastos save(RequisicionDeGastos requisicion) {
        log.debug("Salvando requisicion  {}", requisicion)
        if(!requisicion.id )
            requisicion.folio = nextFolio('REQUISICION', 'GASTOS_CXP')
        actualizarImportes(requisicion)
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion
    }

    RequisicionDeGastos update(RequisicionDeGastos requisicion) {
        actualizarImportes(requisicion)
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion
    }

    @CompileDynamic
    def actualizarImportes(RequisicionDeGastos requisicion) {
        log.debug('Actualizando importes de la requisicion {}', requisicion)

        if(requisicion.porComprobar && !requisicion.partidas) {
            log.debug("Gastos por comprobar no actualizamos partidas")
            requisicion.apagar = requisicion.total
            return requisicion
        }
        /*
        requisicion.partidas.each {RequisicionDet det ->

            CuentaPorPagar cxp = det.cxp
            det.total = cxp.importePorPagar - compensaciones
            det.apagar = det.total
        }
        */
        requisicion.total = requisicion.partidas.sum 0.0, { det -> det.total}
        requisicion.apagar = requisicion.partidas.sum 0.0, { det -> det.apagar}

    }

    RequisicionDeGastos cerrar(RequisicionDeGastos requisicion) {
        log.debug("CERRANDO requisicion de gastos  {}", requisicion)
        logEntity(requisicion)
        requisicion.cerrada = new Date()
        requisicion.save flush: true
        return requisicion
    }

    void delete(RequisicionDeGastos requisicion) throws RequisicionException{
        if(requisicion.cerrada) throw new RequisicionCerradaException(requisicion)
        requisicion.delete flush: true
    }


}

class RequisicionDeGastosException extends RuntimeException {
    RequisicionDeGastosException(String message) {
        super(message)
    }
}


