package sx.cxc

import grails.compiler.GrailsCompileStatic
import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j
//import lx.cfdi.v33.Comprobante
import com.cfdi4.comprobante.Comprobante
import org.apache.commons.lang3.exception.ExceptionUtils
import sx.cfdi.Cfdi
import sx.cfdi.CfdiService
import sx.cfdi.Cfdi4Service
import sx.cfdi.CfdiTimbradoService
import sx.cfdi.v33.NotaDeCargoBuilder
import sx.core.FolioLog
import sx.core.LogUser

import com.cfdi4.Cfdi4NotaDeCargoBuilder



@Slf4j
// @GrailsCompileStatic
@Transactional
class NotaDeCargoService implements  LogUser, FolioLog {

    NotaDeCargoBuilder notaDeCargoBuilder
    Cfdi4NotaDeCargoBuilder cfdi4NotaDeCargoBuilder

    CfdiService cfdiService

    Cfdi4Service cfdi4Service

    CfdiTimbradoService cfdiTimbradoService

    NotaDeCargo save(NotaDeCargo nota) {
        if(!nota.id){
            nota.folio = nextFolio('NOTA_DE_CARGO', nota.serie)
        }

        nota.importe = nota.partidas.sum 0.0, {it.importe}
        nota.impuesto = nota.partidas.sum 0.0, {it.impuesto}
        nota.total = nota.partidas.sum 0.0, {it.total}
        nota.cuentaPorCobrar = generarCuentaPorCobrar(nota)
        actualizarPartidas(nota)
        nota.save failOnError: true, flush:true
        return nota
    }

    CuentaPorCobrar generarCuentaPorCobrar(NotaDeCargo nota) {
        CuentaPorCobrar cxc = new CuentaPorCobrar()
        cxc.sucursal = nota.sucursal
        cxc.cliente = nota.cliente
        cxc.tipoDocumento = 'NOTA_DE_CARGO'
        cxc.importe = nota.importe
        cxc.descuentoImporte = 0.0
        cxc.subtotal = nota.importe
        cxc.impuesto = nota.impuesto
        cxc.total  = nota.total
        cxc.formaDePago = nota.formaDePago
        cxc.moneda = nota.moneda
        cxc.tipoDeCambio = nota.tipoDeCambio
        cxc.comentario = nota.comentario
        cxc.tipo = nota.tipo
        cxc.documento = nota.folio
        cxc.fecha = new Date()
        cxc.comentario = nota.comentario
        logEntity(cxc)
        return cxc
    }

    private actualizarPartidas(NotaDeCargo nota){
        nota.partidas.each { NotaDeCargoDet det ->
            if (det.cuentaPorCobrar) {
                CuentaPorCobrar cxc = det.cuentaPorCobrar
                det.documento = cxc.documento
                det.documentoFecha = cxc.fecha
                det.documentoTipo= cxc.tipo
                det.documentoTotal = cxc.total
                det.documentoSaldo = cxc.saldo
                det.sucursal = cxc.sucursal.nombre
            }
            det.comentario = nota.comentario
        }
    }

    NotaDeCargo generarCfdi(NotaDeCargo nota) {
        if(nota.cfdi)
            throw new RuntimeException("Nota de cargo ${nota.serie} ${nota.folio} YA tiene CFDI (XML) generado")

        //Comprobante comprobante = notaDeCargoBuilder.build(nota)
        Comprobante comprobante = cfdi4NotaDeCargoBuilder.build(nota)
     
        Cfdi cfdi = cfdi4Service.generarCfdi(comprobante, 'I', 'NOTA_CARGO')

        nota.cuentaPorCobrar.cfdi = cfdi
        nota.cfdi = cfdi
        logEntity(nota)
        nota.save flush: true
        return nota
    }

    Cfdi timbrar(NotaDeCargo nota){
        if(nota.cfdi.uuid == null) {
            Cfdi cfdi = nota.cfdi
            cfdi = cfdiTimbradoService.timbrar(cfdi)
            logEntity(cfdi)

            CuentaPorCobrar cxc = nota.cuentaPorCobrar
            cxc.uuid = cfdi.uuid
            logEntity(cxc)
            cxc.save flush: true
            return cfdi
        }
    }


}

class NotaDeCargoException  extends RuntimeException {

    NotaDeCargo notaDeCargo

    NotaDeCargoException(String message) {
        super(message)
    }

    NotaDeCargoException(NotaDeCargo nota, String message) {
        super(message)
        this.notaDeCargo = nota
    }

}
