
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
        comision.addToMovimientos(registrarImporte(comision))
        if(comision.impuesto)
            comision.addToMovimientos(registrarImpuesto(comision))
        return save(comision)
    }

   MovimientoDeCuenta registrarImporte( ComisionBancaria comision) {
       MovimientoDeCuenta egreso = new MovimientoDeCuenta()
       egreso.tipo = 'COMISION'
       egreso.fecha = comision.fecha
       egreso.concepto = comision.concepto
       egreso.moneda = comision.cuenta.moneda
       egreso.tipoDeCambio = 1.0
       egreso.importe = comision.comision.abs() * -1
       egreso.comentario = comision.comentario
       egreso.conceptoReporte = "Comision ${comision.concepto}"
       egreso.formaDePago = 'TRANSFERENCIA'
       egreso.referencia = comision.referencia
       egreso.afavor = Empresa.first().nombre
       egreso.cuenta = comision.cuenta
       logEntity(egreso)
       return egreso
    }

    MovimientoDeCuenta registrarImpuesto(ComisionBancaria comision) {
        MovimientoDeCuenta iva = new MovimientoDeCuenta()
        iva.tipo = 'IVA_COMISION_BANCARIA'
        iva.fecha = comision.fecha
        iva.concepto = comision.concepto
        iva.moneda = comision.cuenta.moneda
        iva.tipoDeCambio = 1.0
        iva.importe = comision.impuesto.abs() * -1
        iva.comentario = comision.comentario
        iva.conceptoReporte = iva.tipo
        iva.formaDePago = 'TRANSFERENCIA'
        iva.referencia = comision.referencia
        iva.afavor = Empresa.first().nombre
        iva.cuenta = comision.cuenta
        logEntity(iva)
        return iva
    }



}
