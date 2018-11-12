package sx.tesoreria

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import groovy.util.logging.Slf4j
import sx.core.Empresa
import sx.core.LogUser

@Slf4j
@GrailsCompileStatic
@Service(CompraDeMoneda)
abstract class CompraDeMonedaService implements  LogUser{

    abstract  CompraDeMoneda save(CompraDeMoneda compra)

    abstract void delete(Serializable id)

    CompraDeMoneda registrar(CompraDeMoneda compra) {
        compra.moneda = compra.cuentaOrigen.moneda
        compra.egreso = buildEgreso(compra)
        compra.ingreso = buildIngreso(compra)
        logEntity(compra)
        return save(compra)
    }

    MovimientoDeCuenta buildEgreso(CompraDeMoneda compra) {
        MovimientoDeCuenta egreso = generarMovimiento(
                compra.fecha,
                compra.importe * -1,
                'COMPRA_MONEDA',
                'RETIRO',
                compra.cuentaOrigen,
                compra.referencia,
                compra.formaDePago)
        return egreso
    }

    MovimientoDeCuenta buildIngreso(CompraDeMoneda compra) {
        MovimientoDeCuenta ingreso = generarMovimiento(
                compra.fecha,
                compra.importe,
                'COMPRA_MONEDA',
                'DEPOSITO',
                compra.cuentaDestino,
                compra.referencia,
                compra.formaDePago)
        return ingreso
    }




    MovimientoDeCuenta generarMovimiento(Date fecha, BigDecimal importe,
                                         String tipo, String concepto,
                                         CuentaDeBanco cuenta,
                                         String referencia,
                                         String formaDePago) {

        MovimientoDeCuenta egreso = new MovimientoDeCuenta()
        egreso.tipo = tipo
        egreso.fecha = fecha
        egreso.concepto = concepto
        egreso.moneda = cuenta.moneda
        egreso.tipoDeCambio = 1.0
        egreso.importe = importe
        egreso.comentario = 'COMPRA DE MONEDA'
        egreso.formaDePago = formaDePago
        egreso.referencia = referencia
        egreso.afavor = Empresa.first().nombre
        egreso.cuenta = cuenta
        logEntity(egreso)
        return egreso

    }
}
