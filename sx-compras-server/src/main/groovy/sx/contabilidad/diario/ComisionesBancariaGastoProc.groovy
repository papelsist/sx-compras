package sx.contabilidad.diario

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import sx.contabilidad.*
import sx.core.Proveedor
import sx.cxp.CuentaPorPagar
import sx.utils.Periodo

@Slf4j
@Component
class ComisionesBancariaGastoProc implements  ProcesadorDePoliza, AsientoBuilder{


    @Override
    String definirConcepto(Poliza poliza) {
        return "${poliza.concepto} (${poliza.fecha.format('dd/MM/yyyy')})"
    }

    @Override
    Poliza recalcular(Poliza poliza) {
        // poliza.manual = true
        poliza.partidas.clear()
        generarAsientos(poliza, [:])
        return poliza
    }

    @Override
    def generarAsientos(Poliza poliza, Map params) {
        List<CuentaPorPagar> facturas = CuentaPorPagar.findAll("""
            from CuentaPorPagar where year(fecha)=? and month(fecha)=? and tipo = ?
        """, [Periodo.obtenerYear(poliza.fecha), Periodo.obtenerMes(poliza.fecha) + 1, 'COMISIONES'])
        log.info('Facturas {}', facturas.size())
        facturas.each { cxp ->
            if(cxp.proveedor.rfc == 'PNA1504108Y2') {
                log.info('Procesando cxp: {} Total: {}', cxp.uuid, cxp.total)
                String desc = """
                    F:${cxp.serie?:''} ${cxp.folio} (${cxp.fecha.format('dd/MM/yyyy')})
                """


                PolizaDet cargo = new PolizaDet()
                CuentaContable cta = buscarCuenta('600-0014-0001-0000')
                cargo.with {
                    cuenta = cta
                    concepto = "${cta.padre ?: cta.padre.descripcion} ${cta.descripcion}"
                    descripcion = desc
                    haber = 0.0
                    debe = cxp.subTotal
                    uuid = cxp.uuid
                    origen = cxp.id
                    sucursal = 'OFICINAS'
                    referencia2 = cxp.nombre
                    referencia = 'BANAMEX'
                }
                poliza.addToPartidas(cargo)

                PolizaDet abono = new PolizaDet()
                cta = buscarCuenta('107-0009-0001-0000')
                abono.with {
                    cuenta = cta
                    concepto = "${cta.padre ?: cta.padre.descripcion} ${cta.descripcion}"
                    descripcion = desc
                    haber = cxp.subTotal
                    debe = 0.0
                    uuid = cxp.uuid
                    origen = cxp.id
                    sucursal = 'OFICINAS'
                    referencia2 = cxp.nombre
                    referencia = 'BANAMEX'
                }
                poliza.addToPartidas(abono)

            }
        }
        poliza.save failOnError: true , flush: true
        return poliza
    }


}
