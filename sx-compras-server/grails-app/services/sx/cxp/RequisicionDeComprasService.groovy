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
class RequisicionDeComprasService implements LogUser, FolioLog{

    RequisicionDeCompras save(RequisicionDeCompras requisicion) {
        log.debug("Salvando requisicion  {}", requisicion)
        requisicion.folio = nextFolio('REQUISICION', 'COMPRAS_CXP')
        actualizarImportes(requisicion)
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion
    }

    RequisicionDeCompras update(RequisicionDeCompras requisicion) {
        actualizarImportes(requisicion)
        logEntity(requisicion)
        requisicion.save failOnError: true, flush: true
        return requisicion
    }

    @CompileDynamic
    def actualizarImportes(RequisicionDeCompras requisicion) {
        log.debug('Actualizando importes de la requisicion {}', requisicion)
        requisicion.total = requisicion.partidas.sum 0, {RequisicionDet det -> det.total}
        requisicion.partidas.each {
            if(requisicion.descuentof > 0.0 ){
                it.descuentof = requisicion.descuentof
            }
            it.apagar = it.total
        }
        requisicion.apagar = requisicion.partidas.sum 0, {RequisicionDet det -> det.apagar}
    }

    RequisicionDeCompras cerrar(RequisicionDeCompras requisicion) {
        log.debug("CERRANDO requisicion de comras  {}", requisicion)
        logEntity(requisicion)
        requisicion.cerrada = new Date()
        requisicion.save flush: true
        return requisicion
    }
}
