package sx.cxp

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.core.FolioLog
import sx.core.LogUser
import sx.utils.MonedaUtils


@Transactional
@GrailsCompileStatic
@Slf4j
class RequisicionDeComprasService implements LogUser, FolioLog{

    RequisicionDeCompras save(RequisicionDeCompras requisicion) {
        log.debug("Salvando requisicion  {}", requisicion)
        if(!requisicion.id )
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
        requisicion.partidas.each {RequisicionDet det ->
            if(requisicion.descuentof > 0.0 ){
                det.descuentof = requisicion.descuentof
                det.descuentofImporte = MonedaUtils.round( (det.descuentof/100) * det.total)
                det.apagar = MonedaUtils.aplicarDescuentosEnCascada(det.total, det.descuentof)
            } else {
                det.apagar = det.total
            }
        }
        requisicion.descuentofImporte = requisicion.partidas.sum 0, {RequisicionDet det -> det.descuentofImporte}
        requisicion.apagar = requisicion.partidas.sum 0, {RequisicionDet det -> det.apagar}
    }

    RequisicionDeCompras cerrar(RequisicionDeCompras requisicion) {
        log.debug("CERRANDO requisicion de comras  {}", requisicion)
        logEntity(requisicion)
        requisicion.cerrada = new Date()
        requisicion.save flush: true
        return requisicion
    }

    void delete(RequisicionDeCompras requisicion) throws RequisicionException{
        if(requisicion.cerrada) throw new RequisicionCerradaException(requisicion)
        requisicion.delete flush: true
    }
}

class RequisicionException extends RuntimeException {

    RequisicionException(String msg) {
        super(msg)
    }
}

class RequisicionCerradaException extends RequisicionException {

    RequisicionCerradaException(Requisicion requisicion){
        super("La requisicion ${requisicion.id} ya esta cerrada no se puede eliminar")
    }
}
