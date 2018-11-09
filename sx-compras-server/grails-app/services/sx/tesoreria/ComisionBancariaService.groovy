
package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service

import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Service(ComisionBancaria)
abstract class ComisionBancariaService implements  LogUser{

    abstract  ComisionBancaria save(ComisionBancaria comision)

    abstract void delete(Serializable id)

    ComisionBancaria registrar(ComisionBancaria comision) {
        logEntity(comision)
        // Re gistrar comision // Conceptos
        // Registrar iva
        return save(comision)
    }




    MovimientoDeCuenta generarMovimiento(Date fecha, BigDecimal importe, String tipo, String concepto, CuentaDeBanco cuenta, String referencia) {

        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = tipo
        egreso.fecha = fecha
        egreso.concepto = concepto
        egreso.moneda = cuenta.moneda
        egreso.tipoDeCambio = 1.0
        egreso.importe = importe
        egreso.comentario = 'TRASPASO ENTRE CUENTAS'
        egreso.formaDePago = 'TRANSFERENCIA'
        // Datos del pago
        egreso.referencia = referencia
        egreso.afavor = Empresa.first().nombre
        egreso.cuenta = cuenta
        logEntity(egreso)
        return egreso

    }
}
