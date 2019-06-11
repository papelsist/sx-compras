package sx.cxc

import grails.gorm.services.Service
import groovy.util.logging.Slf4j
import lx.cfdi.v33.Comprobante
import org.springframework.beans.factory.annotation.Autowired
import sx.cfdi.Cfdi
import sx.cfdi.CfdiService
import sx.cfdi.CfdiTimbradoService
import sx.cfdi.v33.NotaDeCreditoBuilder
import sx.core.FolioLog
import sx.core.LogUser
import sx.utils.MonedaUtils

@Service(NotaDeCredito)
@Slf4j
abstract class NotaDeCreditoService implements FolioLog, LogUser {

    @Autowired
    CfdiService cfdiService

    @Autowired
    NotaDeCreditoBuilder notaDeCreditoBuilder

    @Autowired
    CfdiTimbradoService cfdiTimbradoService

    @Autowired
    CobroService cobroService

    protected abstract NotaDeCredito save(NotaDeCredito nota)

    abstract void delete(Serializable id)

    NotaDeCredito saveNota(NotaDeCredito nota) {

        nota.folio = nextFolio('NOTA_DE_CREDITO', nota.serie)
        return save(nota)
    }

    NotaDeCredito updateNota(NotaDeCredito nota) {
        log.info('Actualizando nota de credito: {} Cobro: {}', nota.id, nota?.cobro?.id)
        actualizarPartidas(nota)
        nota.importe = nota.partidas.sum 0.0, {it.base}
        nota.impuesto = nota.partidas.sum 0.0, {it.impuesto}
        nota.total = nota.partidas.sum 0.0, {it.importe}
        actualizarCobro(nota)
        return save(nota)
    }

    private actualizarPartidas(NotaDeCredito nota) {

        nota.partidas.each { det ->

            det.base = MonedaUtils.calcularImporteDelTotal(det.importe)
            det.impuesto = MonedaUtils.calcularImpuesto(det.base)
            det.importe = MonedaUtils.round(det.base + det.impuesto)
            if(det.cuentaPorCobrar && det.cuentaPorCobrar.cfdi) {
                det.uuid = det.cuentaPorCobrar.cfdi.uuid
            }
        }

    }

    private actualizarCobro(NotaDeCredito nota) {
        if(nota.cobro == null) {
            Cobro cobro = new Cobro()
            cobro.setCliente(nota.cliente)
            cobro.setFecha(nota.fecha)
            cobro.moneda = nota.moneda
            cobro.tipoDeCambio = nota.tc
            cobro.tipo = nota.tipoCartera
            cobro.comentario = nota.comentario
            cobro.createUser = nota.createUser
            cobro.updateUser = nota.updateUser
            cobro.sucursal = nota.sucursal
            cobro.referencia = nota.folio.toString()
            cobro.formaDePago = nota.tipo
            cobro.createUser = nota.createUser
            nota.cobro = cobro
        }
        nota.cobro.importe = nota.total
        nota.cobro.updateUser = nota.updateUser
    }

    NotaDeCredito generarCfdi(NotaDeCredito nota) {
        log.info('Builder: {}', notaDeCreditoBuilder)
        Comprobante comprobante = notaDeCreditoBuilder.build(nota)
        Cfdi cfdi = cfdiService.generarCfdi(comprobante, 'E', 'NOTA_CREDITO')
        cfdi = cfdiTimbradoService.timbrar(cfdi)
        nota.cfdi = cfdi
        logEntity(nota)
        nota.save failOnError: true, flush: true
        return nota
    }

    NotaDeCredito timbrarCfdi(NotaDeCredito nota) {
        Cfdi cfdi = nota.cfdi
        if(!cfdi.uuid) {
            cfdiTimbradoService.timbrar(cfdi)
        }
        return nota
    }

    NotaDeCredito aplicar(NotaDeCredito nota) {
        registrarAplicaciones(nota)
        logEntity(nota)
        nota.save flush: true
        return nota
    }




    private Cobro registrarAplicaciones(NotaDeCredito nota){
        Cobro cobro = nota.cobro
        if(cobro.cfdi) {
            throw new RuntimeException(
                    "Cobro con recibo de pago (CFDI)  ${cobro.cfdi.uuid} " +
                            "NO SE PUEDENDE MODIFICAR ")
        }
        def fecha = new Date()
        def disponible = cobro.disponible
        if (disponible <= 0)
            return cobro
        nota.partidas.each { det ->
            CuentaPorCobrar cxc = det.cuentaPorCobrar
            AplicacionDeCobro aplicacion = new AplicacionDeCobro()
            aplicacion.importe = det.importe
            aplicacion.formaDePago = cobro.formaDePago
            aplicacion.cuentaPorCobrar = cxc
            aplicacion.fecha = fecha

            cobro.addToAplicaciones(aplicacion)
            if(cobro.primeraAplicacion == null)
                cobro.primeraAplicacion = fecha
        }
        logEntity(cobro)
        return cobro
    }

    NotaDeCredito cancelarAplicacion(NotaDeCredito nota) {
        Cobro cobro = nota.cobro
        cobroService.cancelarAplicaciones(cobro)
        logEntity(nota)
        nota.save flush: true
        return nota
    }


}




