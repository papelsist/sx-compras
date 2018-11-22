
package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser
import sx.utils.MonedaUtils

@Slf4j
@GrailsCompileStatic
@Service(DevolucionCliente)
abstract class DevolucionClienteService implements  LogUser{

    MovimientoDeCuentaService movimientoDeCuentaService

    abstract  DevolucionCliente save(DevolucionCliente devolucion)

    abstract void delete(Serializable id)

    DevolucionCliente registrar(DevolucionCliente devolucion) {
        logEntity(devolucion)
        generarEgreso(devolucion)
        return save(devolucion)
    }


    MovimientoDeCuenta generarEgreso( DevolucionCliente devolucion) {
        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.cuenta = devolucion.cuenta
        egreso.fecha = devolucion.fecha
        egreso.tipo = 'DEVOLUCION_CLIENTE'
        egreso.concepto = devolucion.concepto
        egreso.moneda =  devolucion.cobro.moneda
        egreso.tipoDeCambio = devolucion.cobro.tipoDeCambio
        egreso.importe = devolucion.cobro.importe.abs() * -1
        egreso.comentario = devolucion.comentario
        egreso.afavor = devolucion.afavor
        egreso.formaDePago = devolucion.formaDePago
        egreso.referencia = devolucion.referencia
        devolucion.egreso = egreso
        logEntity(egreso)
        return egreso
    }

    DevolucionCliente generarCheque(DevolucionCliente devolucion) {
        if(devolucion.formaDePago == 'CHEQUE' && !devolucion.egreso.cheque) {
            MovimientoDeCuenta egreso = devolucion.egreso
            movimientoDeCuentaService.generarCheque(egreso)
            devolucion.referencia = devolucion.egreso.cheque.folio
            devolucion = devolucion.save flush: true
        }
        return devolucion
    }


}
