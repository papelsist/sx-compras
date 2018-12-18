
package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import sx.core.LogUser


@Slf4j
// @GrailsCompileStatic
@Service(PagoDeNomina)
abstract class PagoDeNominaService implements  LogUser{

    @Autowired
    @Qualifier('movimientoDeCuentaService')
    MovimientoDeCuentaService movimientoDeCuentaService

    abstract  PagoDeNomina save(PagoDeNomina pago)

    abstract void delete(Serializable id)

    ComisionBancaria registrar(PagoDeNomina pagoDeNomina) {
        logEntity(pagoDeNomina)
        return save(pagoDeNomina)
    }

    PagoDeNomina pagar(PagoDeNomina pagoDeNomina, Date fecha, CuentaDeBanco cuenta, String referencia) {
        log.info("Pagando nomina {} Ref: {}", pagoDeNomina.nomina, referencia)
        if(pagoDeNomina.egreso != null)
            throw new RuntimeException("PagoDeNomina ${pagoDeNomina.id} ya pagado Egreso: ${pagoDeNomina.egreso.id}")

        pagoDeNomina.pago = fecha
        MovimientoDeCuenta egreso = generarEgreso(pagoDeNomina, cuenta, referencia)

        pagoDeNomina.egreso = egreso

        if(pagoDeNomina.egreso.formaDePago == 'CHEQUE') {
            generarCheque(pagoDeNomina.egreso)
        }
        pagoDeNomina = save(pagoDeNomina)
        return pagoDeNomina
    }

    MovimientoDeCuenta generarEgreso( PagoDeNomina pago, CuentaDeBanco cuenta, String referencia){
        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.cuenta = cuenta
        egreso.moneda = cuenta.moneda
        egreso.tipo = 'PAGO_NOMINA'
        egreso.concepto = pago.tipo
        egreso.sucursal = 'OFICINAS'
        egreso.fecha = pago.pago
        egreso.tipoDeCambio = 1.0
        egreso.importe = pago.total * -1
        egreso.comentario = "NOMINA ${pago.tipo} / ${pago.periodicidad} / ${pago.folio}"
        egreso.formaDePago = pago.formaDePago
        // Datos del pago
        egreso.referencia = referencia
        egreso.afavor = pago.afavor
        egreso.conceptoReporte = pago.afavor
        logEntity(egreso)
        return egreso
    }


    def generarCheque( MovimientoDeCuenta egreso) {
        if(!egreso.cheque) {
            log.info('Generando cheque para egreso: {} Para: {}', egreso.id, egreso.afavor)
            movimientoDeCuentaService.generarCheque(egreso)
            egreso.save failOnError: true
        }
    }

    PagoDeNomina cancelarCheque(PagoDeNomina pagoDeNomina, String comentario = 'CANCELACION') {

        MovimientoDeCuenta egreso = pagoDeNomina.egreso
        Cheque cheque = egreso.cheque
        if(cheque) {
            cheque.egreso = null
            cheque.cancelado = new Date()
            cheque.canceladoComentario = comentario
            logEntity(cheque)
            cheque.save flush: true

            egreso.cheque = null
            egreso.save flush: true
            pagoDeNomina.refresh()
        }
        return pagoDeNomina

    }



}
