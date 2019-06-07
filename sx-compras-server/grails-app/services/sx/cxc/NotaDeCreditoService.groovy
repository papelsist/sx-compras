package sx.cxc

import grails.gorm.services.Service
import groovy.util.logging.Slf4j
import sx.core.FolioLog
import sx.utils.MonedaUtils

@Service(NotaDeCredito)
@Slf4j
abstract class NotaDeCreditoService implements FolioLog{

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
            det.importe = det.base + det.impuesto
        }
    }

    private actualizarCobro(NotaDeCredito nota) {
        Cobro cobro = nota.cobro
        if(nota.cobro) {
            cobro = new Cobro()
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
        }
        cobro.importe = nota.total
        cobro.updateUser = nota.updateUser
    }
}




