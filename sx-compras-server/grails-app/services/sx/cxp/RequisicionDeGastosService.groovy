package sx.cxp


import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import grails.validation.Validateable
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j

import sx.core.FolioLog
import sx.core.LogUser
import sx.tesoreria.CuentaDeBanco
import sx.tesoreria.MovimientoDeCuentaService

@Transactional
@GrailsCompileStatic
@Slf4j
class RequisicionDeGastosService implements LogUser, FolioLog{

    MovimientoDeCuentaService movimientoDeCuentaService

    PagoService pagoService

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
        requisicion.partidas.each {RequisicionDet det ->
            CuentaPorPagar cxp = det.cxp
            def compensaciones = AplicacionDePago.where{cxp == cxp && (nota.concepto != 'DESCUENTO') }.list().sum 0.0, { it.importe}
            det.total = cxp.importePorPagar - compensaciones
            det.apagar = det.total
        }
        requisicion.total = requisicion.partidas.sum 0.0, {RequisicionDet det -> det.total}
        requisicion.apagar = requisicion.total

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

    /**
     * Registrar pago de requisicion de gastos
     *
     * Nota: En este tipo de requisiciones el pago se aplica automaticamente
     *
     * @param requisicion
     * @param cuenta
     * @param referencia
     * @return
     */
    Requisicion pagar(Requisicion requisicion, CuentaDeBanco cuenta, String referencia) {
        log.info("Pagando requisicion {}", requisicion.folio)
        if(requisicion.egreso != null)
            throw new RequisicionDeGastosException("Requisicion ${requisicion.folio} ya está pagada con el egreso ${requisicion.egreso}")
        if(!requisicion.partidas) {
            throw new RequisicionDeGastosException("Requisicion ${requisicion.folio} no tiene documentos por pagar")
        }
        if(!requisicion.cerrada) {
            throw new RequisicionDeGastosException("Requisicion ${requisicion.folio} no no esta cerrada")
        }

        movimientoDeCuentaService.generarPagoDeGastos((RequisicionDeGastos)requisicion, cuenta, referencia)
        Pago pago = pagoService.pagar(requisicion)
        pagoService.aplicarPago(pago)
        return requisicion.save(flush: true)

    }
}

class RequisicionDeGastosException extends RuntimeException {
    RequisicionDeGastosException(String message) {
        super(message)
    }
}

class PagoDeRequisicion implements  Validateable{
    Requisicion requisicion
    CuentaDeBanco cuenta
    String referencia

    String toString() {
        return "Pago de requisicion ${requisicion.folio} Cuenta: ${cuenta?.clave}  Referencia ${referencia}"
    }

    static constraints =  {
        referencia nullable: true
    }
}

