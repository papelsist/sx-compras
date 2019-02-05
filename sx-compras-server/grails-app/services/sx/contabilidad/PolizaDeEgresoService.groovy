package sx.contabilidad

import grails.compiler.GrailsCompileStatic
import grails.gorm.services.Service
import grails.gorm.transactions.NotTransactional
import groovy.transform.CompileDynamic
import groovy.util.logging.Slf4j
import sx.core.LogUser
import sx.tesoreria.MovimientoDeCuenta

@Slf4j
@GrailsCompileStatic
@Service(Poliza)
abstract class PolizaDeEgresoService  implements  LogUser{

    abstract  Poliza save(Poliza poliza)

    abstract void delete(Serializable id)

    @CompileDynamic
    @NotTransactional
    List<Poliza> generarPolizas(String subtipo, Integer ejercicio, Integer mes, Date fecha) {

        List<MovimientoDeCuenta> egresos = []
        switch (subtipo) {
            case 'CHEQUE':
                egresos = findCheques(fecha)
                break
            case 'TRANSFERENCIA':
                egresos = findTransferencias(fecha)
                break
            default:
                break
        }
        List<Poliza> polizas = []
        egresos.each {
            Poliza p = new Poliza()
            p.ejercicio = ejercicio
            p.mes = mes
            p.fecha = fecha
            p.tipo = 'EGRESO'
            p.subtipo = Poliza.SubtipoEgreso.CHEQUE.name()
            p.concepto = "${it.cuenta.descripcion} CH: ${it?.cheque?.folio ?: 'FALTA'} (${it.tipo})"
            if(it.tipo == 'COMPRA' && it.moneda.currencyCode != 'MXN') {
                p.concepto = p.concepto + " (${it.moneda.currencyCode})"
            }
            PolizaFolio folio = findFolio(p)
            p.folio = folio.folio
            folio.folio = folio.folio + 1
            p.egreso = it.id
            p.save failOnError: true, flush: true
            folio.save flush: true
            polizas << p
        }
        return polizas
    }

    List<MovimientoDeCuenta> findCheques(Date fecha) {
        List<MovimientoDeCuenta> egresos = MovimientoDeCuenta.where {
            fecha == fecha && formaDePago == 'CHEQUE' && importe < 0.0}.list()
        log.info('Cheques a procesar: {}', egresos.size())
        return egresos
    }

    List<MovimientoDeCuenta> findTransferencias(Date fecha) {
        List<MovimientoDeCuenta> egresos = MovimientoDeCuenta.where {
            fecha == fecha && formaDePago == 'TRANSFERENCIA' && importe < 0.0}.list()
        log.info('Transferencias a procesar: {}', egresos.size())
        return egresos
    }

    def findFolio(Poliza poliza){
        PolizaFolio folio = PolizaFolio.findOrSaveWhere(
                ejercicio: poliza.ejercicio,
                mes: poliza.mes,
                tipo: poliza.tipo,
                subtipo: poliza.subtipo
        )
        return folio
    }

}
